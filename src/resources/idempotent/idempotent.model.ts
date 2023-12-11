

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from "@/db/index";
import { IdempotentInstance } from "@/resources/idempotent/idempotent.interface";




const IdempotentSchema = sequelizeConnection.define<IdempotentInstance>("Idempotent", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
        unique: true,
    },
    senderId: {
        allowNull: false,

        type: DataTypes.BIGINT,

    },
    recieverId: {
        allowNull: false,

        type: DataTypes.BIGINT,

    },
    key: {
        type: DataTypes.TEXT,

    },

    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM,
        values: ["PENDING","CONFIRM"],
        defaultValue: "CONFIRM"
    },
    narration: {
        type: DataTypes.TEXT
    },



},

);


export default IdempotentSchema