interface FCRequest {
    path: string;
    method: string;
    headers: any;
    query: any;
}

interface FCResponse {
    statusCode: number;
    headers: any;
    body: any;
}

interface Context {
    req: FCRequest;
    res: FCResponse;
    path: string;
    method: string;
    type: String;
    status: number;
    body?: any;
    set(key: string, value: string);
}

interface FCMiddleWare {
    (ctx: Context): Promise<any>;
}

interface FCHTTPEvent {

}

interface Credentials {
    accessKeyId?: string;
    accessKeySecret?: string;
    securityToken?: string;
}

interface Functions {
    name?: string;
    handler?: string;
    memory?: number;   // Integer, in MB.
    timeout?: number;      // Integer, in seconds.
}

interface FCContext {
    requestId?: string;
    credentials?: Credentials;
    "function"?: Functions;
}

interface FCRAWRequestEvent {
    path: String;
    httpMethod: String;
    headers?: any;
    queryParameters?: any
    pathParameters?: any
    body?: String;
    isBase64Encoded?: boolean
}

interface FCRAWResponse {
    isBase64Encoded?: boolean;
    statusCode?: number;
    headers?: any;
    body?: string
}

interface Tester {
    run(event: FCRAWRequestEvent, ctx?: FCContext): Promise<FCRAWResponse>
    run(event: Buffer, ctx?: FCContext): Promise<any>
}

type AsyncRequestFunc = (event: FCRAWRequestEvent, ctx: FCContext) => Promise<FCRAWResponse>;
type AsyncEventFunc = (event: Buffer, ctx: FCContext) => Promise<any>;

declare module "fc-helper" {
    function hook(middleWare: FCMiddleWare)
    function test(middleWare: FCMiddleWare): Tester
    function asyncWrap(asyncRequestFunc: AsyncRequestFunc): any
    function asyncWrap(asyncEventFunc: AsyncEventFunc): any
}
