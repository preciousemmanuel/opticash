import client, { Connection, Channel, ConsumeMessage } from "amqplib";


type HandlerCB = (msg: string,fn:(v:any)=>any) => any;

class RabbitMQConnection {
    connection!: Connection;
    channel!: Channel;
    private connected!: Boolean;
  
    public async connect():Promise<void> {
      if (this.connected && this.channel) return;
      else this.connected = true;
  
      try {
        console.log(`⌛️ Connecting to Rabbit-MQ Server`);
        this.connection = await client.connect(
          `${process.env.RABIT_URL}`
        );
  
        console.log(`✅ Rabbit MQ Connection is ready`);
  
        this.channel = await this.connection.createChannel();
  
        console.log(`🛸 Created RabbitMQ Channel successfully`);
      } catch (error) {
        console.error(error);
        console.error(`Not connected to MQ Server`);
      }
    }
  
   public async sendToQueue(queue: string, message: any) :Promise<void>{
      try {
        if (!this.channel) {
          await this.connect();
        }
  
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async consume(queue:string,handleIncomingNotification: HandlerCB) {
        if (!this.channel) {
            await this.connect();
          }
        await this.channel.assertQueue(queue, {
          durable: true,
        });
    
        this.channel.consume(
            queue,
          (msg) => {
            {
              if (!msg) {
                return console.error(`Invalid incoming message`);
              }
              handleIncomingNotification(msg?.content?.toString(),(ok)=>{
                ok ? this.channel.ack(msg) : this.channel.reject(msg, true);
              });
            
            }
          },
          {
            noAck: false,
          }
        );
    
      }
  }
  
  const mqConnection = new RabbitMQConnection();

  export default mqConnection;