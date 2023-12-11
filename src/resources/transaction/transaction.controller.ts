import { Request, Response, NextFunction, Router } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import TransactionService from "@/resources/transaction/transaction.service";

import { responseObject } from "@/utils/http.response";
import { HttpCodes } from "@/utils/httpcode";
import authenticatedMiddleware from "@/middleware/authenticated.middleware";



class TransactionController implements Controller {
    public path = "/transaction";
    public router = Router();
    private transactionService = new TransactionService();

    constructor() {
        this.initializeRoute();
    }

    initializeRoute(): void {
        this.router.get(
            `${this.path}/history`,
            authenticatedMiddleware,
           
            this.transactionHistory
        )
       
    }

    private transactionHistory = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        try {
           
            const userId=req.user.id
            const data = await this.transactionService.transactionHistory(userId);
            
            return responseObject(res, HttpCodes.HTTP_OK, "success", "transactions fetched Successfully",data);
                
          
        } catch (error: any) {
            next(new HttpException(HttpCodes.HTTP_BAD_REQUEST, error.message))
        }
    }


  


   
}

export default TransactionController;