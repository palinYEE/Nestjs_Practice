import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * 쿠키에 저장되어있는 Jwt 토큰을 반환하는 데코레이터
 */
export const GetToken = createParamDecorator((data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.cookies['jwt'];
})

/**
 * 로그인 여부를 반환하는 데코레이터
 */
export const CheckLogin = createParamDecorator((data, ctx:ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if(req.cookies['jwt']) {
        return true;
    } 
    return false;
})