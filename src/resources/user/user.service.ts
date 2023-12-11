import User, { UserInput, UserOuput, UserInstance } from "@/resources/user/user.interface";
import UserModel from "@/resources/user/user.model";
import { verificationCode } from "@/utils/helpers";
import { createToken } from "@/utils/token";
import bcrypt from "bcrypt";
import sendEmail from "@/resources/message/email.message";
import WalletService from "@/resources/wallet/wallet.service";
import { sequelizeConnection } from "@/db/index";
import mqConnection from "@/utils/queue/connect.queue";
import { SEND_EMAIL } from "@/utils/queue/type.queue";

class UserService {
    private user = UserModel;

    public async singup(
        name: string,
        email: string,
        password: string
    ): Promise<UserInstance | Error> {

        try {
            //do some checkings

            const userEmailExist = await this.user.findOne({ where: { email } });
            if (userEmailExist) {
                throw new Error("Email already exist");
            }
            const vCode: number = verificationCode();
            const hashPassword = await this.encryptPassword(password)
            const user = {

                name,
                email,
                password: hashPassword,
                verificationCode: vCode,
                verificationExpiry: Date.now() + 60000 * 15,
            }

            const createdUser: UserInstance = await this.user.create(user as any);
            createdUser.password="";
            const emailData = {
                to: email,
                subject: "Verification",
                html: `Hi ${name}, here is your verification code <br/> <b>${vCode}</b>`,
            };
            mqConnection.sendToQueue(SEND_EMAIL,emailData)
           
            return createdUser
        } catch (error: any) {
            throw new Error(error.toString());
        }

    }

    //login
    public async login(
        email: string,
        password: string
    ): Promise<any | Error> {

        try {
            //do some checkings

            const userEmailExist = await this.user.findOne({ where: { email } });
            if (!userEmailExist) {
                throw new Error("No user with this email");
            }
            if (! await this.isPasswordValid(password, userEmailExist.password)) {
                throw new Error("Password is invalid");

            }


            if (!userEmailExist.isEmailVerified) {
                throw new Error("Email is not verified");

            }
            const token = createToken(userEmailExist);
          
           const userData=await this.getUser(userEmailExist.id) as UserInstance;
            let data = {
                ...userData.dataValues,
                token
            }

            return data;


        } catch (error: any) {
            throw new Error(error.toString());
        }

    }
    //resend verification code
    public async resendVerificationCode(

        email: string,

    ): Promise<number | Error> {

        try {
            //do some checkings

            const userEmailExist = await this.user.findOne({ where: { email } });
            if (!userEmailExist) {
                throw new Error("Email does not exist");
            }
            const vCode: number = verificationCode();


            userEmailExist.verificationCode = vCode;
            let now = new Date();
            userEmailExist.verificationExpiry = new Date(now.getTime() + 60000 * 15);

            userEmailExist.save();

            const emailData = {
                to: email,
                subject: "Verification",
                html: `Hi ${userEmailExist.name}, here is your verification code <br/> <b>${vCode}</b>`,
            };
           
            mqConnection.sendToQueue(SEND_EMAIL,emailData)
            return vCode;
        } catch (error: any) {
            throw new Error(error.toString());
        }

    }
    //verify Email
    public async verifyEmail(
        otp: number,
        email: string,

    ): Promise<string | Error> {
        let dbTransaction;
        try {
            //do some checkings

            const userEmailExist = await this.user.findOne({ where: { email } });
            if (!userEmailExist) {
                throw new Error("User with this email do not exist");
            }
            if (userEmailExist.isEmailVerified) {
                throw new Error("User is already verified");
            }
            if (userEmailExist.verificationCode !== otp) {
                throw new Error("Otp is invalid");
            }


            // if(userEmailExist.verificationExpiry < new Date(new Date().getTime())){
            //     throw new Error("Otp is Expired");
            // }
            dbTransaction = await sequelizeConnection.transaction();
            userEmailExist.isEmailVerified = true;
            userEmailExist.save({ transaction: dbTransaction });


            //create user wallet
            const walletService = new WalletService();
            const createdWallet = await walletService.createUserWallet(userEmailExist.id, dbTransaction);
            if (createdWallet !== true) {
                await dbTransaction.rollback()
                throw new Error("Cannot verify user email at this time");

            }
            //generate token
            const token = createToken(userEmailExist);




            await dbTransaction.commit();

            const emailData = {
                to: email,
                subject: "Welcome",
                html: `Hi ${userEmailExist.name}!<br> Welcome to Opticash`,
            };
            mqConnection.sendToQueue(SEND_EMAIL,emailData)

            return token;

        } catch (error: any) {
            if (dbTransaction) {
                await dbTransaction.rollback()
            }
            throw new Error(error.toString());
        }

    }


    private async encryptPassword(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password,10)
        return hashedPassword;
    };



    private async isPasswordValid(password: string, hasedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hasedPassword);

    };

    public async getUser(id:number):Promise<UserInstance|Error|null>{
        try {

         const user= await  this.user.findByPk(id,{attributes:{
            exclude:[
                "password",
                "verificationCode",
                "verificationExpiry"
            ]
         }});
         if (user) {
            return user!;
         }
         return null;
        // throw new Error("user does not exist");

         
        } catch (error:any) {
            console.log("notforur",error);
            throw new Error(error.toString());
        }
    }
}

export default UserService;