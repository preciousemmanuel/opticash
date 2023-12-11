

import { Dialect, Sequelize } from 'sequelize';


const dbName = process.env.DB_NAME as string
const dbUser = process.env.DB_USERNAME as string
const dbHost = process.env.DB_HOST
const dbDriver = "mysql" as Dialect
const dbPassword = process.env.DB_PASSWORD

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver,
  pool:{
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
  
})


export {Sequelize,sequelizeConnection} 