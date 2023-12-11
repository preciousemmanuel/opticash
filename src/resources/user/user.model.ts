
import bcrypt from "bcrypt";
import { DataTypes, Model, Optional } from 'sequelize';
import {sequelizeConnection} from "@/db/index";
import User, { UserInstance } from "./user.interface";




const UserSchema=sequelizeConnection.define<UserInstance> ("User",{
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
        unique: true,
    },
    name:{
        type:DataTypes.TEXT,
        allowNull:false
    },
   
    email:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    isEmailVerified:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    password:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    verificationCode:{
        type:DataTypes.STRING,
        
    },
    verificationExpiry:{
        type:DataTypes.DATE,
        
    },

},

);


export default UserSchema