import { MongoClient } from 'mongodb';
import { join } from 'path';
import { config } from 'dotenv';
config({ path: join(__dirname,'../.env') });

const mongoUri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0.t0iml.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(mongoUri,{useNewUrlParser: true, useUnifiedTopology: true});

const Main = async(): Promise<any> => {
    await client.connect();
    return client;
};

Main()
    .catch(err => console.error(err));

export default client;