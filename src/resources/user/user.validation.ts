import Joi from 'joi';

const signup= Joi.object({
    name:Joi.string().required(),
    email:Joi.string().required(),

    password:Joi.string().required(),

});

const login= Joi.object({
    
    email:Joi.string().required(),

    password:Joi.string().required(),

});

const verifyEmail= Joi.object({
    
    email:Joi.string().required(),

    otp:Joi.string().length(4).required(),

});


export default {signup,login,verifyEmail}