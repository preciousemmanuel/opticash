import { DataTypes, Model, Optional } from 'sequelize'

interface IUser {
    id:number,
    email:string,
    name:string,
    password:string,
    createdAt?: Date;
  updatedAt?: Date;
  isEmailVerified?:boolean; 
  verificationCode?:number;
  verificationExpiry?:Date;

}

export interface UserInput extends Optional<IUser, 'id'> {}
export interface UserOuput extends Required<IUser> {}


export interface UserInstance
  extends Model<IUser, UserInput>,
  IUser {
      createdAt?: Date;
      updatedAt?: Date;
    }




export default IUser;
