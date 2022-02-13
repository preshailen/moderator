import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }
	customEmailValidator(control: AbstractControl): ValidationErrors {
    if (!control.value) {
      return null;
    }
    return Validators.email(control);
  }
	noPriorDateValidator(control: AbstractControl): ValidationErrors {
		if (control.value && moment().isAfter(moment(control.value))) {
			return { 'dueDate': true }
		}
		return null;
	}
	invalidCharacter(control: AbstractControl): ValidationErrors {
		if (control.value && control.value.includes(';')) {
			return { 'invalidCharacter': true }
		}
		return null;
	}
	sameEmailValidator(control: AbstractControl): ValidationErrors {
		let email = localStorage.getItem('eModEmail').split('.').join('');
		email = email.replace('com', '.com');
		if (control.value && control.value === email) {
			return { 'sameEmail': true }
		}
		return null;
	}
  existingValidator(moderators: FormArray): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value) {
        if (moderators.getRawValue().filter(o => o.email === control.value.trim()).length > 0) {
          return { 'alreadyExists': true };
        }
      }
      return null;
    };
  }
  existingNameValidator(moderators: FormArray): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value) {
        if (moderators.getRawValue().filter(o => o.name === control.value.trim()).length > 0) {
          return { 'nameAlreadyExists': true };
        }
      }
      return null;
    };
  }
}
