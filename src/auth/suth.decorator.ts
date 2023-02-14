import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetToken = createParamDecorator((data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.cookies['jwt'];
})

export const CheckLogin = createParamDecorator((data, ctx:ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if(req.cookies['jwt']) {
        return true;
    } 
    return false;
})