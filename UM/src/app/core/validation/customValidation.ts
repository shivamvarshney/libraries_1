import { FormArray, FormControl, FormGroup, ValidationErrors, ReactiveFormsModule  } from '@angular/forms';

export class CustomValidators {
    
    // ******** User DOB validation ******** //
    static birthYear (c: FormControl): ValidationErrors {
        const numValue = Number(c.value);
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 85;
        const maxYear = currentYear - 18;   
        const isValid = !isNaN(numValue) && numValue >= minYear && numValue <= maxYear;
        
        const message = {
            years: {
                message: 'The year must be a valid number between ' + minYear + ' and ' + maxYear + ''
            }
        };
        return isValid ? null : {
          dobValidation: true,
        };
    } 

    // ******** User name validation ******** //
    static onlyName (c: FormControl): ValidationErrors {
        const name = <String>c.value;
        const namePattern = /^[a-zA-Z \-\']+/;
        const isMatch = namePattern.test(c.value);

        const message = {
            name: {
                message: 'Name accept only alphabetic'
            }
        };
        return isMatch ? null : message;
    }

    // ******** Number Validation ******** //
    static numberOnly (c: FormControl): ValidationErrors {
        const number = Number(c.value);
        const numberPattern = /^[0-9]*$/;
        const isMatch = numberPattern.test(c.value);

        const message = {
            name: {
                message: 'Accept only number'
            }
        };
        return isMatch ? null : message;
    }

    // ******** Email Validation ******** //
    static emailValidator(control) {
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
          return null;
        } else {
          return { 'invalidEmailAddress': true };
        }
      }
    
      // ******** Password Validation ******** //
      static passwordValidator(control) {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
          return null;
        } else {
          return { 'invalidPassword': true };
        }
      }

    // ******** Common Error Messages ******** //
      static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
          'required': 'Required',
          'invalidEmailAddress': 'Invalid email address',
          'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
          'minlength': `Minimum length ${validatorValue.requiredLength}`
        };
    
        return config[validatorName];
      }
 

}