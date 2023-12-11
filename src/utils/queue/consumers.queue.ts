import sendEmail from "@/resources/message/email.message";



async function fnConsumerEmail(msg:string,callback:Callback){
    try {
        const emailData = JSON.parse(msg);
        sendEmail(emailData);
        callback(true);
    } catch (error) {
        callback(true);
        
    }
}

export {fnConsumerEmail}
