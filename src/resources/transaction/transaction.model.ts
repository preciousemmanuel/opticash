

import { DataTypes, Model, Optional } from 'sequelize';
import {sequelizeConnection} from "@/db/index";
import  { TransactionInstance,TransactionStatus } from "@/resources/transaction/transaction.interface";
import UserSchema from '@/resources/user/user.model';




const TransactionSchema=sequelizeConnection.define<TransactionInstance> ("Transaction",{
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
        unique: true,
    },
    senderId:{
        allowNull: false,
        
        type: DataTypes.BIGINT,
       
    },
    recieverId:{
        allowNull: false,
        
        type: DataTypes.BIGINT,
       
    },
    userId:{
        allowNull: false,
        
        type: DataTypes.BIGINT,
    },
    amount:{
        type:DataTypes.FLOAT,
        allowNull:false,
        defaultValue:0
    },
    status:{
        type:DataTypes.ENUM,
        values:["PENDING","FAILED","SUCCESS"],
        defaultValue:"PENDING"
        },
        narration:{
            type:DataTypes.TEXT
        },
      
        transactionType:{
            type:DataTypes.STRING
        }
    

},

);

TransactionSchema.belongsTo(UserSchema,{
    foreignKey:"senderId",
    as:"sender",

});
TransactionSchema.belongsTo(UserSchema,{
    foreignKey:"recieverId",
    as:"reciever"
})



export default TransactionSchema