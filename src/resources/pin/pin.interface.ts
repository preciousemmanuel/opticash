import {  Model, Optional } from 'sequelize'



interface IPin {
    id: number;
    userId: number;
    pin: string;
    
    createdAt?: Date;
    updatedAt?: Date;


}

export interface PinInput extends Optional<IPin, 'id'> { }
export interface PinOutput extends Required<IPin> { }


export interface PinInstance
    extends Model<IPin, PinInput>,
    IPin {
    createdAt?: Date;
    updatedAt?: Date;
}




export default IPin;
