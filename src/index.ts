import * as http from 'http';
import * as url from 'url';
import * as https from 'https';
import { StringDecoder } from 'string_decoder';
import {parse} from 'querystring';
const httpsSecret: string = '';

const httpServer = http.createServer((req: http.IncomingMessage,res: http.ServerResponse) => {
    mainServer(req,res);
});

// const httpsServer = https.createServer(_,(req: http.IncomingMessage,res: http.ServerResponse) => {
//     mainServer(req,res);
// });

const mainServer = (req: http.IncomingMessage,res: http.ServerResponse) => {
    const {URL} = url;
    const { pathname } = new URL(req.url!);
    const parsedQuery = parse(req.url!);

    console.log(pathname);
    console.log(parsedQuery);

};

interface ICallback{
    (err?: Error|null, result?: object|null):void,
};

const httpCallback:ICallback = (err,result) => {
    !err ? console.log(`HTTP Server listening on ${process.env.HTTP_PORT}`) : console.error(err);
};

const httpsCallback:ICallback = (err,result) => {
    !err ? console.log(`HTTPS Server listening on ${process.env.HTTPS_PORT}`) : console.error(err);
};

httpServer.listen(process.env.HTTP_PORT,httpCallback);
// httpsServer.listen(process.env.HTTPS_PORT,httpsCallback);

