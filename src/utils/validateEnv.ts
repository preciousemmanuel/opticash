import { cleanEnv,str,port } from "envalid";

function validateEnv():void{
    cleanEnv(process.env,{
        NODE_ENV:str({
            choices:['dev','prod']
        }),
        DB_HOST:str(),
        DB_USERNAME:str(),
        DB_PASSWORD:str(),
        DB_NAME:str(),
        JWT_SECRET:str(),

        PORT:port({default:3000})
    })
}

export default validateEnv;