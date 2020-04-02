import * as express from 'express';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import logService from './services/logService';

export const globals = {
    root: __dirname + "/..",
    getConfigFilename(): string {
        return path.resolve(this.root + "/config/config.json");
    },
    getPublicHtmlFile(filename: string): string {
        return path.resolve(this.root + "/public_html/" + filename);
    }
}

const SERVERPORT=8080;
const checkConsistency = true;
const LOG = logService.getLog('AaiTestCollectorServer');
class AaiTestCollectorServer {

    private app: express.Express;
    private server: http.Server;
    private timer: NodeJS.Timeout | null;
    public constructor() {

        this.app = express();
        this.app.use(express.json());
        this.timer = null;
        this.server = http.createServer(this.app);
        // get resources
        //this.app.use(bodyParser.raw({type:".*",inflate:true,limit:10000}));
        this.app.use(express.urlencoded({ extended: true }))
        this.app.get('/*', (req, resp) => { this.onGetRequest(req, resp); })
        this.app.post('/*', (req, resp) => { this.onPostRequest(req, resp); })
        this.app.put('/*', (req, resp) => { this.onPutRequest(req, resp); })
        this.app.delete('/*', (req, resp) => { this.onDeleteRequest(req, resp); })
    }
    private onGetRequest(request:express.Request, response: express.Response) {
        this.logRequest("GET",request,response);
        this.sendJsonResponse(response,{});
    }
    private onPostRequest(request:express.Request, response: express.Response) {
        this.logRequest("POST",request,response);
        this.sendJsonResponse(response,{});
    }
    private onPutRequest(request:express.Request, response: express.Response) {
        this.logRequest("PUT",request,response);
        this.sendJsonResponse(response,{});
    }
    private onDeleteRequest(request:express.Request, response: express.Response) {
        this.logRequest("DELETE",request,response);
        this.sendJsonResponse(response,{});
    }
    private logRequest(method:string,request:express.Request, response: express.Response){
        LOG.info("===============================================");
        LOG.info(`received ${method} request to ${request.url}`);
        const contentType=request.headers["content-type"];
        LOG.info(`type:${contentType}`);
        var data='';
        request.on('data', chunk => {
            data += chunk.toString(); // convert Buffer to string
        });
        request.on('end', () => {
            if(data){ 
                LOG.info(`content:${((contentType||"")=="application/json")?JSON.stringify(data):(data)}`);
            }
            response.end('ok');
        });
    }
    private onGetFile(response: express.Response, filename: string) {
        const fn = globals.getPublicHtmlFile(filename);

        LOG.debug("try to load res file " + fn);
        if (!fs.existsSync(fn)) {
            response.sendStatus(404);
        }
        else {
            const ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
            switch (ext) {
                case 'html':
                case 'htm':
                    response.setHeader("Content-Type", "text/html");
                    break;
                case 'js':
                    response.setHeader("Content-Type", "application/javascript");
                    break;
                default:
                    response.setHeader("Content-Type", "text/plain");
                    break;

            }
            response.sendFile(fn);
        }

    }
    private sendJsonResponse(response: express.Response, data: any) {
        response.setHeader("Content-Type", "application/json")
        response.send(JSON.stringify(data));
    }
    public start(): void {
        this.server.listen(SERVERPORT, () => {
            LOG.debug('Server started listening on port ' + SERVERPORT + '.');
        });
    }
    public stop(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.server.close();
    }
}

process.on('SIGINT', function() {
    console.log('SIGINT');
    process.exit();
});
//start our server
const server = new AaiTestCollectorServer();
server.start(); 
