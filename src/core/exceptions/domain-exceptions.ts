import { DomainExceptionCode } from './filters/domain-exceptions-code';

class Extension {
  constructor(
    public message: string,
    public field: string,
  ) {}
}

class DomainException extends Error {
  message: string;
  code: DomainExceptionCode;
  extensions: Extension[];

  constructor(errorInfo: {
    code: DomainExceptionCode;
    message?: string;
    extensions?: Extension[];
  }) {
    super(errorInfo.message || '');
    // для явности
    this.message = errorInfo.message || '';
    this.code = errorInfo.code;
    this.extensions = errorInfo.extensions || [];
  }
}

export { DomainException, Extension };
