import {
    RequestPrefix, RequestMapping, Controller, RequestParam,
    RequestMethod, Validate
} from "@/decorator/Controller";
import JSONResult from "@/utils/JSONResult";

@Controller
@RequestPrefix('/api')
export default class TestController{

    @Validate
    @RequestMapping('/test', RequestMethod.POST)
    public async test1(
        ctx,
        @RequestParam('name', {require: true}) name,
        @RequestParam('age', {require: true, length: 3}) age,
        @RequestParam('sex', {require: false}) sex,
    ) {
        // console.log('name',name)
        // console.log('age',age)
        // console.log('sex',sex)
        // return ''
        ctx.rest(JSONResult.ok(1))
        // console.log(ctx.request.body)
        // ctx.body = 'test1';
    }

    // @RequestMapping('test/t2', RequestMethod.GET)
    // public static async test2(ctx) {
    //     ctx.body = 'test2';
    // }

};
