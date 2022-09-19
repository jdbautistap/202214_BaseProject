import { IsDate, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class ClubDto {
@IsString()
@IsNotEmpty()
readonly nombre: string;
 
@IsDate()
@IsNotEmpty()
readonly fechaFundacion: string;
 
@IsUrl()
@IsNotEmpty()
readonly imagen: string;
 
@IsString()
@IsNotEmpty()
readonly descripcion: string;
}
