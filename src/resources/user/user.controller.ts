import { Request, Response, NextFunction, Router } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import UserService from "@/resources/user/user.service";
import validate from "./user.validation";
import { responseObject } from "@/utils/http.response";
import { HttpCodes } from "@/utils/httpcode";



class UserController implements Controller {
    public path = "/user";
    public router = Router();
    private userService = new UserService();

    constructor() {
        this.initializeRoute();
    }

    initializeRoute(): void {
        this.router.post(
            `${this.path}/signup`,
            validationMiddleware(validate.signup),
            this.signup
        ),
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        ),
        this.router.post(
            `${this.path}/validateOtp`,
            validationMiddleware(validate.verifyEmail),
            this.validateOtp
        )
    }

    private signup = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        try {
            const { name, email, password } = req.body;
            const data = await this.userService.singup(name, email, password);
            return responseObject(res, HttpCodes.HTTP_CREATED, "success", "Signup successfull...Please verify your email", data);

        } catch (error: any) {
            next(new HttpException(HttpCodes.HTTP_BAD_REQUEST, error.message))
        }
    }


    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        try {
            const { name, email, password } = req.body;
            const data = await this.userService.login( email, password);
            return responseObject(res, HttpCodes.HTTP_CREATED, "success", "Signup successfull...Please verify your email", data);

        } catch (error: any) {
            next(new HttpException(HttpCodes.HTTP_BAD_REQUEST, error.message))
        }
    }


    private resendOtp = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        try {
            const { name, email, password } = req.body;
            const data = await this.userService.singup(name, email, password);
            return responseObject(res, HttpCodes.HTTP_CREATED, "success", "Signup successfull...Please verify your email", data);

        } catch (error: any) {
            next(new HttpException(HttpCodes.HTTP_BAD_REQUEST, error.message))
        }
    }

    private validateOtp = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        try {
            const { otp, email } = req.body;
            const data = await this.userService.verifyEmail(otp,email);
            return responseObject(res, HttpCodes.HTTP_CREATED, "success", "Email verified successfully", data);

        } catch (error: any) {
            next(new HttpException(HttpCodes.HTTP_BAD_REQUEST, error.message))
        }
    }
}

export default UserController;