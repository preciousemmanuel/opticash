import {  Model, Optional } from 'sequelize'

// export enum status{
//     PENDING,
//     CONFIRMED
// }

interface Iidempotent {
    id: number;
    senderId: number;
    recieverId: number;
    key: string;
    amount: number;
    status?: string;
    narration: string;
    createdAt?: Date;
    updatedAt?: Date;


}

export interface IdempotentInput extends Optional<Iidempotent, 'id'> { }
export interface IdempotentOutput extends Required<Iidempotent> { }


export interface IdempotentInstance
    extends Model<Iidempotent, IdempotentInput>,
    Iidempotent {
    createdAt?: Date;
    updatedAt?: Date;
}




export default Iidempotent;
