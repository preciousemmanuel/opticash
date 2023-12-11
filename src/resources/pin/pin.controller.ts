import { Request, Response, NextFunction, Router } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import PinService from "@/resources/pin/pin.service";
import validate from "@/resources/pin/pin.validation";
import { responseObject } from "@/utils/http.response";
import { HttpCodes } from "@/utils/httpcode";
import authenticatedMiddleware from "@/middleware/authenticated.middleware";



class PinController implements Controller {
    public path = "/pin";
    public router = Router();
    private pinService = new PinService();

    constructor() {
        this.initializeRoute();
    }

    initializeRoute(): void {
        this.router.post(
            `${this.path}/create`,
            authenticatedMiddleware,
            validationMiddleware(validate.create),
            this.create
        )
       
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        try {
            const { pin } = req.body;
            const userId=req.user.id
            const data = await this.pinService.createPin(userId, pin);
            if (data) {
            return responseObject(res, HttpCodes.HTTP_OK, "success", "Pin Created Successfully");
                
            }
            return responseObject(res, HttpCodes.HTTP_BAD_REQUEST, "error", "Cannot create pin");

        } catch (error: any) {
            next(new HttpException(HttpCodes.HTTP_BAD_REQUEST, error.message))
        }
    }


  


   
}

export default PinController;