import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1920)
  @Max(2050)
  year: number;

  @IsNumber()
  @Min(0)
  @Max(3000000)
  kilometers: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(10000000)
  price: number;
}
