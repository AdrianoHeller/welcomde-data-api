import * as http from 'http';
import * as url from 'url';
import { StringDecoder } from 'string_decoder';

const httpServer = http.createServer((req: http.IncomingMessage,res: http.ServerResponse) => {
    mainServer(req,res);
});

interface IPayload{
    method: string|any,
    headers: http.IncomingHttpHeaders,
    path: string,
    body: string,
};

const mainServer = (req: http.IncomingMessage,res: http.ServerResponse) => {
    const {parse} = url;
    const { pathname } = parse(req.url!,true);
    const { method, headers } = req;
    const parsedPath = pathname!.replace(/^\/+\/+$/g,'');
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
            path: parsedPath,
            body: buffer
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

httpServer.listen(process.env.HTTP_PORT,httpCallback);

interface IMainRouterProps{
    ping: (payload: IPayload,res: http.ServerResponse) => void,
    [parsedPath: string]: (payload: IPayload,res: http.ServerResponse) => void,
    notFound: (payload: IPayload,res: http.ServerResponse) => void,
};

const MainRouter: IMainRouterProps = {
    ping:(payload: IPayload,res: http.ServerResponse) => {
        res.setHeader('Content-Type','application/json');
        res.writeHead(200);
        res.end('Ok');
    },
    notFound:(payload: IPayload,res: http.ServerResponse) => {
        res.setHeader('Content-Type','application/json');
        res.writeHead(404);
        res.end('Ok');
    },  
};

