import * as http from 'http';
import * as https from 'https';
import * as url from 'url';
import * as fs from 'fs';
import client from './db';
import {join} from 'path';
import { StringDecoder } from 'string_decoder';
import axios from 'axios';
import { ParsedUrlQuery } from 'querystring';
const serverConfig = {
    key: fs.readFileSync(join(__dirname,'../cert/server.key')),
    cert: fs.readFileSync(join(__dirname,'../cert/server.cert')),
};

const httpServer = http.createServer((req: http.IncomingMessage,res: http.ServerResponse):void => {
    mainServer(req,res);
});

const httpsServer = https.createServer(serverConfig,(req: http.IncomingMessage,res: http.ServerResponse):void => {
    mainServer(req,res);
});

interface IPayload{
    method: string|any,
    headers: http.IncomingHttpHeaders,
    params: ParsedUrlQuery,
    path: string,
    body: string,
    bodyParser: Function,
};

const mainServer = (req: http.IncomingMessage,res: http.ServerResponse):void => {
    const {parse} = url;
    const { pathname,query } = parse(req.url!,true);
    const { method, headers } = req;
    const parsedPath = pathname!.replace(/^\/+|\/+$/g,'');
    const Decoder: StringDecoder = new StringDecoder('utf-8');
    let buffer: string = '';
    req.on('data', stream => {
        buffer += Decoder.write(stream);
    });
    req.on('end', () => {
        buffer += Decoder.end();
        
        let payload: IPayload = {
            method,
            headers,
            params: query,
            path: parsedPath,
            body: buffer,
            bodyParser: (stringData: string) => {
                try{
                    return JSON.parse(stringData);
                }catch(err){
                    return {}
                }
            }
        };

        switch(Object.keys(MainRouter).includes(parsedPath)){
            case true:
                MainRouter[parsedPath](payload,res);
                break;
            default:
                MainRouter['notFound'](payload,res);
                break;    
        };
    });
};

interface ICallback{
    (err?: Error|null, result?: object|null):void,
};

const httpCallback:ICallback = (err,result) => {
    !err ? console.log(`HTTP Server listening on ${process.env.HTTP_PORT}`) : console.error(err);
};

const httpsCallback:ICallback = (err,result) => {
    !err ? console.log(`HTTP Server listening on ${process.env.HTTPS_PORT}`) : console.error(err);
};

httpServer.listen(process.env.HTTP_PORT,httpCallback);
httpsServer.listen(process.env.HTTPS_PORT,httpsCallback);

interface IMainRouterProps{
    ping: (payload: IPayload,res: http.ServerResponse) => void,
    [key: string]: (payload: IPayload,res: http.ServerResponse) => void,
    notFound: (payload: IPayload,res: http.ServerResponse) => void,
};

const MainRouter: IMainRouterProps = {
    ping:(payload: IPayload,res: http.ServerResponse) => {
        res.setHeader('Content-Type','application/json');
        res.writeHead(200);
        res.end('Ok');
    },
    'monde/people': async(payload: IPayload,res: http.ServerResponse):Promise<any> => {
        try{        
        const tokenData: string = `${process.env.MONDE_TOKEN}`;
        let config = { 
            httpsAgent: new https.Agent({ keepAlive: true }),
            headers: { Authorization: `Bearer ${tokenData}`} }
        const mondeData = await axios.get('https://web.monde.com.br/api/v2/people',config);
        res.writeHead(200);
        res.end(JSON.stringify(mondeData.data));    
        }catch(err){
            console.log(err);
            res.writeHead(404);
            res.end(JSON.stringify(err));
        };        
    },
    'monde/tasks': async(payload: IPayload,res: http.ServerResponse):Promise<any> => {
        try{        
        const tokenData: string = `${process.env.MONDE_TOKEN}`;
        let config = { 
            httpsAgent: new https.Agent({ keepAlive: true }),
            headers: { Authorization: `Bearer ${tokenData}`} }
        const mondeData = await axios.get('https://web.monde.com.br/api/v2/tasks',config);
        res.writeHead(200);
        res.end(JSON.stringify(mondeData.data));    
        }catch(err){
            console.log(err);
            res.writeHead(404);
            res.end(JSON.stringify(err));
        };        
    },
    'monde/tokens': async(payload: IPayload,res: http.ServerResponse):Promise<any> => {
        interface ITokenPayloadProps{            
            data: {
                "type": string,
                "attributes": {
                "login": string,
                "password": string
                }
            }              
        };
        try{        
            const patternBody: ITokenPayloadProps = {
                data: {
                    type: `${process.env.MONDE_DATA_TYPE}`,
                    attributes: {
                        login:`${process.env.MONDE_LOGIN_CREDENTIAL}`,
                        password:`${process.env.MONDE_LOGIN_PASSWORD}`,
                    }
                }
            };
            let config = { 
                httpsAgent: new https.Agent({ keepAlive: true }),
            };
            const responseToken = await axios.post('https://web.monde.com.br/api/v2/tokens',patternBody,config);
            res.writeHead(200);
            res.end(JSON.stringify(responseToken.data));    
        }catch(err){
            console.log(err);
            res.writeHead(404);
            res.end(JSON.stringify(err));
        };        
    },
    'moskit/activities': async(payload: IPayload,res: http.ServerResponse):Promise<any> => {
        try{        
        const apiKey: string = `${process.env.MOSKIT_TOKEN}`;
        let config = { 
            httpsAgent: new https.Agent({ keepAlive: true }),
            headers: { apikey: `${apiKey}`} }
        const mondeData = await axios.get('https://api.moskitcrm.com/v1/activities',config);
        res.writeHead(200);
        res.end(JSON.stringify(mondeData.data));    
        }catch(err){
            console.log(err);
            res.writeHead(404);
            res.end(JSON.stringify(err));
        };        
    },
    'moskit/activityTypes': async(payload: IPayload,res: http.ServerResponse):Promise<any> => {
        try{        
        const apiKey: string = `${process.env.MOSKIT_TOKEN}`;
        let config = { 
            httpsAgent: new https.Agent({ keepAlive: true }),
            headers: { apikey: `${apiKey}`} }
        const mondeData = await axios.get('https://api.moskitcrm.com/v1/activityTypes',config);
        res.writeHead(200);
        res.end(JSON.stringify(mondeData.data));    
        }catch(err){
            console.log(err);
            res.writeHead(404);
            res.end(JSON.stringify(err));
        };        
    },
    'moskit/companies': async(payload: IPayload,res: http.ServerResponse):Promise<any> => {
        try{        
        const apiKey: string = `${process.env.MOSKIT_TOKEN}`;
        let config = { 
            httpsAgent: new https.Agent({ keepAlive: true }),
            headers: { apikey: `${apiKey}`} }
        const mondeData = await axios.get('https://api.moskitcrm.com/v1/companies',config);
        res.writeHead(200);
        res.end(JSON.stringify(mondeData.data));    
        }catch(err){
            console.log(err);
            res.writeHead(404);
            res.end(JSON.stringify(err));
        };        
    },
    'moskit/contacts': async(payload: IPayload,res: http.ServerResponse):Promise<any> => {
        try{        
        const apiKey: string = `${process.env.MOSKIT_TOKEN}`;
        let config = { 
            httpsAgent: new https.Agent({ keepAlive: true }),
            headers: { apikey: `${apiKey}`} }
        const mondeData = await axios.get('https://api.moskitcrm.com/v1/contacts',config);
        res.writeHead(200);
        res.end(JSON.stringify(mondeData.data));    
        }catch(err){
            console.log(err);
            res.writeHead(404);
            res.end(JSON.stringify(err));
        };        
    },
    'moskit/deals': async(payload: IPayload,res: http.ServerResponse):Promise<any> => {
        try{        
        const apiKey: string = `${process.env.MOSKIT_TOKEN}`;
        let config = { 
            httpsAgent: new https.Agent({ keepAlive: true }),
            headers: { apikey: `${apiKey}`} }
        const mondeData = await axios.get('https://api.moskitcrm.com/v1/deals',config);
        res.writeHead(200);
        res.end(JSON.stringify(mondeData.data));    
        }catch(err){
            console.log(err);
            res.writeHead(404);
            res.end(JSON.stringify(err));
        };        
    },
    'moskit/emailTypes': async(payload: IPayload,res: http.ServerResponse):Promise<any> => {
        try{        
        const apiKey: string = `${process.env.MOSKIT_TOKEN}`;
        let config = { 
            httpsAgent: new https.Agent({ keepAlive: true }),
            headers: { apikey: `${apiKey}`} }
        const mondeData = await axios.get('https://api.moskitcrm.com/v1/emailTypes',config);
        res.writeHead(200);
        res.end(JSON.stringify(mondeData.data));    
        }catch(err){
            console.log(err);
            res.writeHead(404);
            res.end(JSON.stringify(err));
        };        
    },
    'moskit/lostReasons': async(payload: IPayload,res: http.ServerResponse):Promise<any> => {
        try{        
        const apiKey: string = `${process.env.MOSKIT_TOKEN}`;
        let config = { 
            httpsAgent: new https.Agent({ keepAlive: true }),
            headers: { apikey: `${apiKey}`} }
        const mondeData = await axios.get('https://api.moskitcrm.com/v1/lostReasons',config);
        res.writeHead(200);
        res.end(JSON.stringify(mondeData.data));    
        }catch(err){
            console.log(err);
            res.writeHead(404);
            res.end(JSON.stringify(err));
        };        
    },
    'moskit/phoneTypes/companies': async(payload: IPayload,res: http.ServerResponse):Promise<any> => {
        try{        
        const apiKey: string = `${process.env.MOSKIT_TOKEN}`;
        let config = { 
            httpsAgent: new https.Agent({ keepAlive: true }),
            headers: { apikey: `${apiKey}`} }
        const mondeData = await axios.get('https://api.moskitcrm.com/v1/phoneTypes/companies',config);
        res.writeHead(200);
        res.end(JSON.stringify(mondeData.data));    
        }catch(err){
            console.log(err);
            res.writeHead(404);
            res.end(JSON.stringify(err));
        };        
    },
    'files': async(payload,res):Promise<any> => {
        const db = await client.db();
        const data = await db.collection('files').find().toArray();
        res.writeHead(200);
        res.end(JSON.stringify(data)); 
    },
    'filesTest': async(payload,res):Promise<any> => {
        const db = await client.db();
        const acceptableMethods: string[] = ['POST'];
        const { params,body,bodyParser,method } = payload;
        const parsedBody =  bodyParser(body);
        acceptableMethods.includes(method) ? (
            await db.collection('files').insertOne(parsedBody),
            res.writeHead(200),
            res.end(JSON.stringify(params))
        ) : (
            res.writeHead(405),
            res.end()
        )        
    },              
    notFound: (payload: IPayload,res: http.ServerResponse) => {
        res.setHeader('Content-Type','application/json');
        res.writeHead(404);
        res.end(JSON.stringify({'Message': 'Server not Found.'}));             
    },  
};

