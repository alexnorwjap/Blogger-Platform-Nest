import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { Trim } from '../transform/trim';

export const IsEmailLengthTrim = () => {
  return applyDecorators(Trim(), IsNotEmpty(), IsString(), IsEmail());
};
