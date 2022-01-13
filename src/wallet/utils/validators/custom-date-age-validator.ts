/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { toDifYears, toMomentDate } from '../date-transform';
import { dateRegex } from '../default-regex';

@ValidatorConstraint({ name: 'customCpfValidator', async: false })
export default class CustomDateIsOlderAgeValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    if (!dateRegex.test(text)) {
      return false;
    }
    const date = toMomentDate(text);
    if (!date.isValid) {
      return false;
    }
    const age = toDifYears(date);
    if (age < 18) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'The informed date is invalid, it should have the format of dd/mm/yyyy and be greater than 18 years from now';
  }
}
