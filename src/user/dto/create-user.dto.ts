import { IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    // @IsString()
    // @IsNotEmpty()
    // type: string

    @IsString()
    @IsNotEmpty()
    role: string = 'user'
}
