import { WalletInstance } from "@/resources/wallet/wallet.interface";
import WalletModel from "@/resources/wallet/wallet.model";
import { Sequelize, sequelizeConnection } from "@/db/index";
import PinService from "@/resources/pin/pin.service";
import IdepotentService from "../idempotent/idempotent.service";

import TransactionService from "@/resources/transaction/transaction.service";
import UserService from "@/resources/user/user.service";
import { TransactionStatus } from "@/resources/transaction/transaction.interface";
import mqConnection from "@/utils/queue/connect.queue";
import { SEND_EMAIL } from "@/utils/queue/type.queue";
import { UserInstance } from "../user/user.interface";

class WalletService {
    private wallet = WalletModel;

    public async createUserWallet(
        userId: number,
        transaction: any

    ): Promise<boolean | Error> {

        try {
            const createdWallet: WalletInstance = await this.wallet.create({
                userId,
                totalBalance: 0
            }, { transaction });
            return true;
        } catch (error: any) {
            if (transaction) {
                await transaction.rollback()
            }
            throw new Error(error.toString());
        }

    }

    //view wallet balance
    public async userWalletBalance(userId: number): Promise<WalletInstance | Error> {
        try {
            const wallet = await this.wallet.findOne({ where: { userId } });
            if (!wallet) {
                throw new Error("Wallet not found");
            }
            return wallet;

        } catch (error: any) {
            throw new Error(error.toString())
        }
    }





    //send money
    public async sendMoney(
        userId: number,
        recieverId: number,
        amount: number,
        pin: string,
        narration: string,
        idpotentKey: string) {
        let dbTransaction;
        try {

            
            //check duplicate transaction
            const idempotentService = new IdepotentService();
            const keyExist = await idempotentService.checkKeyExist(idpotentKey);
            if (keyExist) {
                throw new Error("Duplicate transaction");
            }

            //check pin
            const pinService = new PinService();
            const isValidPin = await pinService.checkPin(pin, userId);
            if (!isValidPin) {
                throw new Error("Pin is incorrect");
            }

            //check senderwallet balance
            const senderwallet = await this.userWalletBalance(userId) as WalletInstance;

            if (senderwallet!.totalBalance < amount) {
                throw new Error("Insufficient funds");
            }

            const userService = new UserService();

            //sender info
            const senderData = await userService.getUser(userId) as UserInstance;

            //reciever info
            const recieverData = await userService.getUser(recieverId) as UserInstance;
            if(!recieverData){
            throw new Error("Reciever do no exist");

            }


            dbTransaction = await sequelizeConnection.transaction();


            await idempotentService.createKey(idpotentKey, amount, narration, userId, recieverId);

            console.log("dsdsdd");
            await this.deductWallet(userId, amount, dbTransaction);
            console.log("dsdkdosdo");
            const successCredit=await this.creditWallet(recieverId, amount, dbTransaction);
            if (!successCredit) {
                throw new Error("Cannot credit wallet");
            }
            console.log("dsdsdoosds");

            //savetransaction history
            const transaction = new TransactionService();
           await transaction.createHistory(
            userId,
                amount,
                narration,
                userId,
                recieverId,
                "SUCCESS",
                "DEBIT",
                dbTransaction

            );

            await transaction.createHistory(
                recieverId,
                amount,
                narration,
                userId,
                recieverId,
                "SUCCESS",
                "CREDIT",
                dbTransaction

            );
            console.log("dsdkdllshere")

            //update idomkeey
            await idempotentService.updateStatus(idpotentKey);

            await dbTransaction.commit();



            //send notification to sender 


            const senderEmailData = {
                to: senderData.email,
                subject: "Transaction",
                html: `Transfer of  ${senderwallet.currency}${amount} to ${recieverData.name} is successful`
            }

            const reecieverEmailData = {
                to: recieverData.email,
                subject: "Transaction",
                html: `${senderData.name} successfully transffered  ${senderwallet.currency}${amount} to you`
            }

            mqConnection.sendToQueue(SEND_EMAIL, senderEmailData);
            mqConnection.sendToQueue(SEND_EMAIL, reecieverEmailData);
            return true;

        } catch (error: any) {
            if (dbTransaction) {
                await dbTransaction.rollback()
            }
            throw new Error(error.toString());
        }
    }


    private async deductWallet(userId: number, amount: number, dbTransaction: any): Promise<void | Error> {
        try {
            let walletResult = await this.wallet.findOne({
                where: {
                    userId
                }
            });
            walletResult!.totalBalance =walletResult!.totalBalance- amount;
            walletResult?.save({ transaction: dbTransaction });

        }
        catch (error: any) {
            console.log("sdsdd",error)
            // if (dbTransaction) {
            //     await dbTransaction?.rollback()
            // }
            throw new Error(error.toString());
        }

    }

    private async creditWallet(userId: number, amount: number, dbTransaction: any): Promise<boolean | Error> {
        try {
            let walletResult = await this.wallet.findOne({
                where: {
                    userId
                }
            });
            if (!walletResult) {
                throw new Error("Wallet to credit not available");

            }

            walletResult!.totalBalance =walletResult!.totalBalance+ amount;
            walletResult.save({ transaction: dbTransaction });
            return true;
        }
        catch (error: any) {
            console.log("sdssdds",error)
            // if (dbTransaction) {
            //     await dbTransaction?.rollback()
            // }
            throw new Error(error.toString());
        }

    }



}

export default WalletService;