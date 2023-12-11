import express ,{Application} from 'express';

import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from './middleware/error.middleware';
import {sequelizeConnection} from './db';
import mqConnection from '@/utils/queue/connect.queue';
import { SEND_EMAIL } from '@/utils/queue/type.queue';
import { fnConsumerEmail } from './utils/queue/consumers.queue';


class App{
    public express: Application;
    public port : number;

    constructor(controllers:Controller[],port:number){
        this.express=express();
        this.port=port;

        this.initializeDB();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
        this.connectQueueConsumers();
    }

   

    private initializeMiddleware():void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan("dev"));
        this.express.use(express.json());
        this.express.use(express.urlencoded({extended:false}));
        this.express.use(compression());

    }

    private initializeControllers(controllers:Controller[]):void{
            controllers.forEach((controller:Controller)=>{
                this.express.use("/api",controller.router)
            })
    }

    private initializeErrorHandling():void{
        this.express.use(ErrorMiddleware);
    }


    private initializeDB() : void{
    sequelizeConnection.sync({force:false});
    }
    private connectQueueConsumers(){
        mqConnection.consume(SEND_EMAIL,fnConsumerEmail);
    }

    public listen() :void{
        this.express.listen(this.port,()=>{
            console.log(`server runing on port ${this.port}`)
        })
    }
}

export default App;