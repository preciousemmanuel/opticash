import {  Model, Optional } from 'sequelize'

export enum TransactionStatus{
    PENDING,
    SUCCESS,
    FAILED
}

interface ITransaction {
    id: number;
    userId:number;
    senderId: number;
    recieverId: number;
    amount: number;
    status?:string;
    narration? : string;

    transactionType: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TransactionInput extends Optional<ITransaction, 'id'> { }
export interface TransactionOutput extends Required<ITransaction> { }


export interface TransactionInstance
    extends Model<ITransaction, TransactionInput>,
    ITransaction {
    createdAt?: Date;
    updatedAt?: Date;
}




export default ITransaction;
