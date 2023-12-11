import Joi from 'joi';

const create= Joi.object({
    pin:Joi.string().required().length(4),
   

});




export default {create}