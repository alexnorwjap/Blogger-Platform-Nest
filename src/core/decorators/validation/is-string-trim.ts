import { IsString, IsNotEmpty } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { Trim } from '../transform/trim';

export const IsStringTrim = () => {
  return applyDecorators(Trim(), IsNotEmpty(), IsString());
};
