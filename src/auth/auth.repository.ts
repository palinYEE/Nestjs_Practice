import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { authDto } from "./dtos/auth.dto";
import { authEntity } from "./entity/auth.entity";
import * as bcrypt from 'bcrypt';

/**
 * 'auth_entity' 테이블과 typeORM 으로 통신하는 Repository 구현 클래스
 */
@Injectable()
export class AuthRepository extends Repository<authEntity> {
    constructor(private dataSource: DataSource) {
        super(authEntity, dataSource.createEntityManager());
    } 

    /**
     * 'auth_entity' 테이블에 데이터를 생성하는 함수
     * @param authdto 아이디, 비밀번호, 입력 확인용 비밀번호, 표시할 이름 데이터가 저장되어있는 dto
     */
    async createAuth(authdto: authDto): Promise<void> {
        const {username, password, displayname} = authdto;
        if(password !== authdto.compare_password){
            throw new UnauthorizedException('Not Equal password');
            return;
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.create({
            username,
            password: hashedPassword,
            displayname
        })
        try {
            await this.save(user);
        } catch (error) {
            if(error.code ==='23505'){
                throw new ConflictException('Existing username');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}