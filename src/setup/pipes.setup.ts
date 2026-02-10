import { INestApplication, ValidationError, ValidationPipe } from '@nestjs/common';
import { DomainException, Extension } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';

export const errorFormatter = (
  errors: ValidationError[],
  errorMessage?: Extension[],
): Extension[] => {
  const errorsForResponse = errorMessage || [];

  for (const error of errors) {
    if (!error.constraints && error.children?.length) {
      errorFormatter(error.children, errorsForResponse);
    } else if (error.constraints) {
      for (const key in error.constraints) {
        errorsForResponse.push({
          message: error.constraints[key],
          field: error.property,
        });
      }
    }
  }

  return errorsForResponse;
};

export function pipesSetup(app: INestApplication) {
  //Глобальный пайп для валидации и трансформации входящих данных.
  app.useGlobalPipes(
    new ValidationPipe({
      //class-transformer создает экземпляр dto со  всеми методами и свойствами
      transform: true,
      //Выдавать первую ошибку для каждого поля
      whitelist: false,
      // удалять свойства без декораторов валидации
      stopAtFirstError: true,

      exceptionFactory: (errors) => {
        const errorsForResponse = errorFormatter(errors);
        throw new DomainException({
          code: DomainExceptionCode.ValidationError,
          message: 'errorsMessages',
          extensions: errorsForResponse,
        });
      },
    }),
  );
}
