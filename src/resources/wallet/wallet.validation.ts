import Joi from 'joi';

const sendMoney= Joi.object({
    pin:Joi.string().required().length(4),
    amount:Joi.number().required(),
    recieverId:Joi.number().required(),
    narration:Joi.string(),
   

});




export default {sendMoney}