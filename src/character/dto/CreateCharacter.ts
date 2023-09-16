import { IsString, IsNotEmpty, IsEnum, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCharacterDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    gender: string;

    @IsString()
    @IsEnum(['Alive', 'Dead', 'Unknown'])
    status: string;

    @IsString()
    @IsEnum(['Cursed Spirit', 'Human', 'Unknown'])
    specie: string;


    @ApiProperty()
    @IsUrl()
    imagen: string;

}