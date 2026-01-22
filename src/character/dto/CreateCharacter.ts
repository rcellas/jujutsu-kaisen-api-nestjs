import { IsString, IsNotEmpty, IsEnum, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCharacterDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    gender: string;

    @IsString()
    status: string;

    @IsString()
    specie: string;

    @ApiProperty()
    @IsString()
    mangaImage: string;

    @ApiProperty()
    @IsString()
    animeImage: string;

    @IsString()
    kanji: string;

    @IsString()
    romaji: string;

    @IsString()
    occupation: string;

    @IsString()
    firstAppearanceManga: string;

    @IsString()
    firstAppearanceAnime: string;
}