import { IdempotentInstance } from "@/resources/idempotent/idempotent.interface";
import IdempotentModel from "@/resources/idempotent/idempotent.model";;
import { Op } from "sequelize";


class IdepotentService {
    private idepotentModel = IdempotentModel;



    //create Pin
    public async createKey(
        key: string,
        amount: number,
        narration: string,
        senderId: number,
        recieverId: number
    ): Promise<void | Error> {
        try {


            const result = await this.idepotentModel.create({ key, amount, narration, senderId, recieverId });


        } catch (error: any) {
            throw new Error(error.toString());
        }
    }

    public async updateStatus(
        key: string,
        

    ): Promise<void | Error> {
        try {


            const result = await this.idepotentModel.update({ status:"CONFIRM" }, {
                where: {
                    key
                }
            });


        } catch (error: any) {
            throw new Error(error.toString());
        }
    }


    public async checkKeyExist(key: string): Promise<IdempotentInstance | Error> {
        try {
            const record = await this.idepotentModel.findOne({ where: { key } });

            return record!;
        } catch (error: any) {
            throw new Error(error.toString());

        }


    };






}

export default IdepotentService;