//если специфических кодов будет много лучше разнести их в соответствующие модули
enum DomainExceptionCode {
  //common
  NotFound = 'NOT_FOUND',
  BadRequest = 'BAD_REQUEST',
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  Forbidden = 'FORBIDDEN',
  ValidationError = 'VALIDATION_ERROR',
  TooManyRequests = 'TOO_MANY_REQUESTS',
  //auth
  Unauthorized = 'UNAUTHORIZED',
  EmailNotConfirmed = 'EMAIL_NOT_CONFIRMED',
  ConfirmationCodeExpired = 'CONFIRMATION_CODE_EXPIRED',
  PasswordRecoveryCodeExpired = 'PASSWORD_RECOVERY_CODE_EXPIRED',
  //...
}
export { DomainExceptionCode };
