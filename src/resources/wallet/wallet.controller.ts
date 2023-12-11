import { Request, Response, NextFunction, Router } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import WalletService from "@/resources/wallet/wallet.service";
import validate from "@/resources/wallet/wallet.validation";
import { responseObject } from "@/utils/http.response";
import { HttpCodes } from "@/utils/httpcode";
import authenticatedMiddleware from "@/middleware/authenticated.middleware";
import idempotentMiddleware from "@/middleware/idempotent.middleware";



class WalletController implements Controller {
    public path = "/wallet";
    public router = Router();
    private walletService = new WalletService();

    constructor() {
        this.initializeRoute();
    }

    initializeRoute(): void {
        this.router.get(
            `${this.path}/`,
            authenticatedMiddleware,

            this.fetchWallet
        ),
            this.router.post(
                `${this.path}/sendmoney`,
                authenticatedMiddleware,
                idempotentMiddleware,

                validationMiddleware(validate.sendMoney),
                this.sendMoney
            )

    }

    private  sendMoney=async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void>=> {
        try {
            const { recieverId, amount, narration, pin } = req.body;
            const idempotentKey: string = req.headers.idempotentkey as string;
            console.log("idmpodikey", idempotentKey);
            const result = await this.walletService.sendMoney(
                req.user.id,
                recieverId,
                amount,
                pin,
                narration,
                idempotentKey
            );
            if (result) {
                return responseObject(res, HttpCodes.HTTP_CREATED, "success", "Transaction successful");

            } else {
                return responseObject(res, HttpCodes.HTTP_BAD_REQUEST, "error", "Transaction not successful");

            }
        } catch (error: any) {
            next(new HttpException(HttpCodes.HTTP_BAD_REQUEST, error.message))

        }
    }

    private fetchWallet = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        try {

            const userId = req.user.id
            const data = await this.walletService.userWalletBalance(userId);

            return responseObject(res, HttpCodes.HTTP_OK, "success", "wallet fetched Successfully", data);


        } catch (error: any) {
            next(new HttpException(HttpCodes.HTTP_BAD_REQUEST, error.message))
        }
    }






}

export default WalletController;