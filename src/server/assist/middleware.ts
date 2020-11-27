import jwt from "jsonwebtoken";
import JSONResult from "@/utils/JSONResult";
import {getRedisIns} from "@/server/redis";
import {JWT_SECRET} from "@/constans/global";
import whitelist from "@/constans/whitelist";

export const cors = () => {
    return async (ctx, next) => {
        // if (process.env.NODE_ENV === ENV_PROD){
        //     ctx.set("Access-Control-Allow-Origin", "https://localhost:8001");
        // } else {
        //     ctx.set("Access-Control-Allow-Origin", "*");
        // }
        ctx.set("Access-Control-Allow-Origin", "*");
        ctx.set("Access-Control-Allow-Credentials", "false");
        ctx.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");
        ctx.set("Access-Control-Allow-Headers", "Content-Type,Authorization,Accept,token,x-requested-with");
        // ctx.set("X-XSS-Protection", "1; mode=block");
        // ctx.set("Content-Security-Policy", "default-src \'self\' code.jquery.com;form-action \'self\'");
        // ctx.set("X-FRAME-OPTIONS", "DENY");
        if (ctx.method === "OPTIONS"){
            ctx.set("Access-Control-Max-Age", 3600 * 24);
            ctx.body = ""
        }
        await next();
    }
};

export const sign = (obj) => {
    return jwt.sign(obj, JWT_SECRET, {expiresIn: "30d"}); //1h  1d
}

const urlJudge = (request_url) => {
    if (request_url.indexOf("?") > -1){
        const final_request_url = request_url.split("?")[0];
        return !!whitelist.includes(final_request_url);
    }else{
        return !!whitelist.includes(request_url);
    }
}

export const verify = () => {
    return async (ctx, next) => {
        const request_url = ctx.request.url;
        if (urlJudge(request_url)){
            await next();
        }else{
            const token = ctx.request.header.token;
            const redisResult = await getRedisIns().get(token);
            if (redisResult){
                await next()
            }else{
                await jwt.verify(token, JWT_SECRET, null, async (err, decoded) => {//此处解密为异步
                    if (err){
                        ctx.response.body = JSONResult.authority()
                    }else{
                        await next()
                    }
                });
            }
        }
    }
}

export const restIfy = (pathPrefix?: string) => {
    pathPrefix = pathPrefix || "/api/";
    return async (ctx, next) => {
        if (ctx.request.path.startsWith(pathPrefix)) {
            ctx.rest = (data) => {
                ctx.response.type = "application/json";
                ctx.response.body = data;
            };
            try {
                await next();
            } catch (e) {
                ctx.response.status = 400;
                ctx.response.type = "application/json";
                ctx.response.body = {
                    code: e ? e.code : "internal:unknown_error",
                    msg: e ? e.message : ""
                };
            }
        } else {
            await next();
        }
    };
}

// export const APIError = (code?, msg?: string) => {
//     this.code = code || "internal:unknown_error";
//     this.msg = msg || "";
// };
