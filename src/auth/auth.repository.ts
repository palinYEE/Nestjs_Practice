import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { authDto } from "./dtos/auth.dto";
import { authEntity } from "./entity/auth.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository extends Repository<authEntity> {
    constructor(private dataSource: DataSource) {
        super(authEntity, dataSource.createEntityManager());
    } 

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