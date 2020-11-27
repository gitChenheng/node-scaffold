import {Controller, RequestMapping, RequestMethod, RequestParam, RequestPrefix, Validate} from "@/decorator/Controller";

@Controller
@RequestPrefix('/admin')
export default class UserController{

    @Validate
    @RequestMapping('/user', RequestMethod.POST)
    public async getInfo(
        ctx,
        @RequestParam('username', {require: true}) username,
        @RequestParam('userage', {require: true, length: 4}) userage,
        @RequestParam('usersex', {require: false}) usersex,
    ){
        ctx.response.type = "application/json";
        ctx.response.body = {a: 1};
    }

}
