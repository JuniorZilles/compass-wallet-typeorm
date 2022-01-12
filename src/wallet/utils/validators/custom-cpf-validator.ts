/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { cpfRegex } from '../default-regex';
import validateCPF from './cpf-validator';

@ValidatorConstraint({ name: 'customCpfValidator', async: false })
export default class CustomCpfValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    if (!cpfRegex.test(text)) {
      return false;
    }
    return validateCPF(text);
  }

  defaultMessage(args: ValidationArguments) {
    return 'The CPF is invalid, it should have the format of xxx.xxx.xxx-xx.';
  }
}
