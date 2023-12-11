import "dotenv/config";
import "module-alias/register";
import validateEnv from '@/utils/validateEnv';
import App from "./app";
import UserController from "@/resources/user/user.controller";
import PinController from "@/resources/pin/pin.controller";
import WalletController from "@/resources/wallet/wallet.controller";
import TransactionController from "@/resources/transaction/transaction.controller";

validateEnv();

const app =new App([
    new UserController(),
    new PinController(),
    new WalletController(),
    new TransactionController(),
],Number(process.env.PORT));

app.listen();