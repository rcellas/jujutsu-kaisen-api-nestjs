import { IsString, IsNotEmpty, IsEnum, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCharacterDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    gender: string;

    @IsString()
    @IsEnum(['Alive', 'Dead', 'unknown'])
    status: string;

    @IsString()
    species: string;


    @ApiProperty()
    @IsUrl()
    imagen: string;

}