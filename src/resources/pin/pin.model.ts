

import { DataTypes, Model, Optional } from 'sequelize';
import {sequelizeConnection} from "@/db/index";
import  { PinInstance } from "@/resources/pin/pin.interface";




const PinSchema=sequelizeConnection.define<PinInstance> ("Pin",{
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
        unique: true,
    },
    userId:{
        allowNull: false,
        
        type: DataTypes.BIGINT,
        unique: true,
    },
    pin:{
        type:DataTypes.TEXT,
        
    },
   
    

},

);


export default PinSchema