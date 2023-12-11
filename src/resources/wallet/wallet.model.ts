

import { DataTypes, Model, Optional } from 'sequelize';
import {sequelizeConnection} from "@/db/index";
import  { WalletInstance } from "@/resources/wallet/wallet.interface";




const WalletSchema=sequelizeConnection.define<WalletInstance> ("Wallet",{
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
    totalBalance:{
        type:DataTypes.FLOAT,
        allowNull:true,
        defaultValue:0
    },
    currency:{
        type:DataTypes.ENUM,
        values:["EUR","USD","NGN"],
        defaultValue:"NGN"
        }
    

},

);


export default WalletSchema