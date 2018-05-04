interface FCRequest{
    path:string;
    method:string;
    headers:any;
    query:any;
}

interface FCResponse{
    statusCode:number;
    headers:any;
    body:any;
}

interface Context {
    req:FCRequest;
    res:FCResponse;
    path:string;
    method:string;
    type:String;
    status:number;
    body?:any;
    set(key:string,value:string);
}

interface FCMiddleWare {
    (ctx: Context):Promise<any>;
}

declare module "fc-helper" {
    function hook(middleWare: FCMiddleWare)
}
