import dotenv from "dotenv";

import path from "path";

dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});


export default  {
    NODE_ENV: process.env.NODE_ENV || "dev",
    PORT: process.env.PORT || "dev",
    DB_HOST: process.env.DB_HOST || "dev",
    DB_USERNAME: process.env.DB_USERNAME || "dev",
    DB_PASSWORD: process.env.DB_PASSWORD || "dev",
    DB_NAME: process.env.DB_NAME || "dev",
    JWT_SECRET: process.env.JWT_SECRET || "dev",

}