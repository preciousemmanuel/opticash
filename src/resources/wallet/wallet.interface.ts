import {  Model, Optional } from 'sequelize'

// export enum Currency{
//     "USD",
//     "NGN",
//     "EUR"
// }

interface IWallet {
    id: number;
    userId: number;
    totalBalance: number;
    currency?:string;
    createdAt?: Date;
    updatedAt?: Date;


}

export interface WalletInput extends Optional<IWallet, 'id'> { }
export interface WalletOutput extends Required<IWallet> { }


export interface WalletInstance
    extends Model<IWallet, WalletInput>,
    IWallet {
    createdAt?: Date;
    updatedAt?: Date;
}




export default IWallet;
