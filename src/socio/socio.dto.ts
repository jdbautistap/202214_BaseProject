import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class SocioDto {
@IsString()
@IsNotEmpty()
readonly usuario: string;
 
@IsString()
@IsNotEmpty()
readonly correo: string;
 
@IsDateString()
@IsNotEmpty()
readonly fechaNacimiento: Date;
}
