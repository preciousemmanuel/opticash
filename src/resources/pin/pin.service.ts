import { PinInstance } from "@/resources/pin/pin.interface";
import PinModel from "@/resources/pin/pin.model";;
import { Op } from "sequelize";
import bcrypt from "bcrypt";

class PinService {
    private pinModel = PinModel;

   

    //create Pin
    public async createPin(userId:number,pin:string):Promise<boolean|Error>{
        try {
            const foundPin=await this.pinModel.findOne({where:{userId}});
            if(foundPin){
                throw new Error("You have an active pin");
            }
            const hashedPin=await bcrypt.hash(pin.toString(),10);

       const pinCreated = await this.pinModel.create({userId,pin:hashedPin});
       
       if(pinCreated){
        return true;
       }
       return false;
            
        } catch (error:any) {
            throw new Error(error.toString());
        }
    }



    


    public async checkPin(pin:string,userId:number): Promise<boolean|Error> {
        try {
            const foundPin=await this.pinModel.findOne({where:{userId}});
            if (!foundPin) {
                throw new Error("Wrong transaction pin... Please set your set if you have not")  ;
            }

            return await bcrypt.compare(pin.toString(), foundPin.pin);  
        } catch (error:any) {
            throw new Error(error.toString())  ;
            
        }
     

    };






}

export default PinService;