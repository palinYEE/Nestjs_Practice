import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class authDto {
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    username: string;               /* 유저 아이디 */
    
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    @Matches(
        /^[a-zA-Z0-9]*$/, {
        message: 'password only accepts english and number'
    })
    password: string;               /* 유저 비밀번호 */
    
    @IsNotEmpty()
    compare_password: string;       /* 비밀번호 확인 용 변수 */
    
    @IsNotEmpty()
    displayname: string;            /* 화면에 출력할 닉네임 */
}