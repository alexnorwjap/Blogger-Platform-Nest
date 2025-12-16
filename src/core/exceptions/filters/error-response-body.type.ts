import { Extension } from '../domain-exceptions';
import { DomainExceptionCode } from './domain-exceptions-code';

export type ErrorResponseBody = {
  timestamp: string;
  path: string | null;
  message: string;
  extensions: Extension[];
  code: DomainExceptionCode;
};

export type ErrorResponseBodyForProduction = {
  [key: string]: {
    message: string;
    field: string;
  }[];
};
