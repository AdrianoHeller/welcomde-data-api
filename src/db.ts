import { MongoClient } from 'mongodb';
import { join } from 'path';
import { config } from 'dotenv';
config({ path: join(__dirname,'../.env') });

const mongoUri = process.env.NODE_ENV === 'staging' ? process.env.MONGO_STAGING_URI : process.env.MONGO_PRODUCTION_URI;
const client = new MongoClient(mongoUri!,{useNewUrlParser: true, useUnifiedTopology: true});

const Main = async(): Promise<any> => {
    await client.connect();
    return client;
};

Main()
    .then(db => console.log(db))
    .catch(err => console.error(err));

export default client;