import { IsString, Length, IsNotEmpty } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { Trim } from '../transform/trim';

export const IsStringLengthTrim = (min: number, max: number) => {
  return applyDecorators(Trim(), IsNotEmpty(), IsString(), Length(min, max));
};
