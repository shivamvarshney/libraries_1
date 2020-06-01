import { FieldConfig,FormDetails } from './field.interface';
import { Validators } from '@angular/forms';

class DefaultFormFields {

    private regConfig: FieldConfig[];
    private createUserForm:FormDetails;

    constructor() {
        
    }
    getFieldData() {
        this.getDefaultFields();
        this.getDefaultFormConfigs();
        let fieldObj = { defaultFields: this.regConfig,defaultFormConfig:this.createUserForm };
        return fieldObj;
    }

    getDefaultFormConfigs(){
        this.createUserForm = {
            name:'createUser',
            class:'createUser'
        }
        return this.createUserForm;
    }
    getDefaultFields() {
        this.regConfig = [
            {
                type: "input",
                label: "First name",
                inputType: "text",
                name: "fname",
                placeHolder: 'Name',
                validations: [
                    {
                        name: "required",
                        validator: Validators.required,
                        message: "First name is Required"
                    },
                    {
                        name: "pattern",
                        validator: Validators.pattern("^[a-zA-Z]+$"),
                        message: "Accept only text"
                    }
                ]
            },
            {
                type: "date",
                label: "Date Of Birth",
                name: "dob",
                placeHolder: 'dd-mm-yy',
                validations: [
                    {
                        name: "required",
                        validator: Validators.required,
                        message: "Date of Birth is Required"
                    }
                ]
            },
            {
                type: "input",
                label: "Mobile Number",
                inputType: "text",
                name: "mobileno",
                placeHolder: 'Number',
                validations: [
                    {
                        name: "required",
                        validator: Validators.required,
                        message: "Mobile Number is Required"
                    },
                    {
                        name: "pattern",
                        validator: Validators.pattern("^[0-9]+$"),
                        message: "Accept only numbers"
                    }
                ]
            },
            {
                type: "input",
                label: "Last name",
                inputType: "text",
                name: "lname",
                placeHolder: 'Name',
                validations: [
                    {
                        name: "required",
                        validator: Validators.required,
                        message: "Last name is Required"
                    },
                    {
                        name: "pattern",
                        validator: Validators.pattern("^[a-zA-Z]+$"),
                        message: "Accept only text"
                    }
                ]
            },
            {
                type: "select",
                label: "Role",
                name: "role",
                value: '',
                options: [
                    {
                        label: 'Select',
                        value: ''
                    },
                    {
                        label: 'Admin',
                        value: 'Admin'
                    },
                    {
                        label: 'Agent',
                        value: 'Agent'
                    }
                ],
                validations: [
                    {
                        name: "required",
                        validator: Validators.required,
                        message: "Role is Required"
                    }
                ]
            },
            {
                type: "select",
                label: "Primary Language",
                name: "primarylanguage",
                value: '',
                options: [
                    {
                        label: 'Select',
                        value: ''
                    },
                    {
                        label: 'Swahili',
                        value: 'Swahili'
                    }
                ],
                validations: [
                    {
                        name: "required",
                        validator: Validators.required,
                        message: "Primary Language is Required"
                    }
                ]
            },
            {
                type: "button",
                label: "Create"
            }
        ];
        return this.regConfig;
    }
}

export function createDefaultField() {
    return new DefaultFormFields();
}
