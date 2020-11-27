import Router from "koa-router";
import {or} from "sequelize";
type Middleware = Router.IMiddleware;

export enum ClassType {
    CTRL = 'ctrl',
}
export enum RequestMethod {
    GET = 'get',
    POST = 'post',
    DELETE = 'delete',
    ALL = 'all',
    PUT = 'put',
    HEAD = 'head',
    PATCH = 'patch',
}
export interface RouteDefinition {
    path: string;
    requestMethod: RequestMethod;
    methodName: string;
}
export const Controller = (target) => {
    target.type = ClassType.CTRL;
}
export const RequestPrefix = (prefix: string = ''): ClassDecorator => {
    return (target): void => {
        Reflect.defineMetadata('requestPrefix', prefix, target);
    };
};
export const RequestMapping = (
    path: string,
    method?: RequestMethod,
    middleware?: Middleware[] | Middleware
): any => {
    return (target, propertyKey: string): void => {
        /**
         * 如果装饰于类的public方法，target为类的实例化对象，target.constructor为类的构造方法
         * 如果装饰于类的static方法上，target为类的普通函数方法
         */
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }
        /**
         * middleware
         */
        let mds = Array.isArray(middleware) ? middleware : [middleware];
        mds = mds.filter(item => item !== undefined);
        Reflect.defineMetadata('mds', [...mds], target.constructor);

        /**
         * routes
         */
        const routes = Reflect.getMetadata('routes', target.constructor) as RouteDefinition[];
        routes.push({
            requestMethod: method || RequestMethod.GET,
            path,
            methodName: propertyKey
        });
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};

// const parseConf = [];
export function RequestParam(type, options){
    return (target, name, index) => {
        // console.log('index',index, type, options, name)
        // parseConf[index] = type;
        target[type] = options;
        // console.log('parseConf[index]:', type);
    };
}
// 在函数调用前执行格式化操作
export function Validate(target, name, descriptor) {
    const originalMethod = descriptor.value;
    console.log('descriptor',descriptor, target)
    descriptor.value =  (ctx) => {
        const params = Object.keys(target); // 预置参数
        const body = ctx.request.body; // 传入的参数
        console.log(params)
        for (const o of params){
            console.log(target[o])
            const opt = target[o];
            if (opt.require && !body[o]){
                ctx.status = 400;
                ctx.body = {
                    code: '0',
                    msg: `缺省参数 ${o}`
                }
                return ;
            }
            if (opt.length && body[o].length > opt.length){
                ctx.status = 400;
                ctx.body = {
                    code: '0',
                    msg: `${o} length err`
                }
                return ;
            }
        }
        // for (const k in body){
        //     console.log(k,body[k])
        //     console.log(target[k])
        //     // if(target[k].require && ){
        //     //
        //     // }
        // }
        // console.log('parseConf',parseConf)
        // console.log('descriptor',descriptor, target)
        // console.log(Object.keys(descriptor))
        // return originalMethod.apply(this, ctx);
        return originalMethod.call(this, ctx);

        // for (let index = 0; index < parseConf.length; index++) {
        //     const type = parseConf[index];
        //     console.log('type',type);
        //     switch (type) {
        //         case 'number':
        //             args[index] = Number(args[index]);
        //             break;
        //         case 'string':
        //             args[index] = String(args[index]);
        //             break;
        //         case 'boolean':
        //             args[index] = String(args[index]) === 'true';
        //             break;
        //     }
        //     return originalMethod.apply(this, args);
        // }
    };
    return descriptor;
}
