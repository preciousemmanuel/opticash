import { TransactionInstance, TransactionStatus } from "@/resources/transaction/transaction.interface";
import TransactionModel from "@/resources/transaction/transaction.model";;
import { Op } from "sequelize";
import UserSchema from "@/resources/user/user.model";

class TransactionService {
    private transaction = TransactionModel;



    //view wallet balance
    public async transactionHistory(userId: number): Promise<TransactionInstance[] | Error> {
        try {
            const transactions = await this.transaction.findAll({
                where: {
                    
                         userId 
                    
                },
                include:[{
                    model:UserSchema,
                    as:"sender",
                    attributes:[
                        "id",
                        "name",
                        "email"
                    ]
                },
                {
                    model:UserSchema,
                    as:"reciever",
                    attributes:[
                        "id",
                        "name",
                        "email"
                    ]
                },
            
            ]
            });

            return transactions;

        } catch (error: any) {
            throw new Error(error.toString())
        }
    }


    public createHistory = async (
        userId:number,
        amount: number,
        narration: string,
        senderId: number,
        recieverId: number,
        status: string,
        type: string,
        dbTransaction: any
    ): Promise<void | Error> => {
        try {


            const result = await this.transaction.create({userId, status: status, amount, narration, senderId, recieverId, transactionType: type }

                , { transaction: dbTransaction });


        } catch (error: any) {
            console.log("errurt", error)
            if (dbTransaction) {
                await dbTransaction.rollback();
            }
            throw new Error(error.toString());
        }
    }



}

export default TransactionService;