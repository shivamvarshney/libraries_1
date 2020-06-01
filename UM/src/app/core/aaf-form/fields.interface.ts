import { FormGroup } from '@angular/forms';

export interface FormDetails {
  class?: string;
  name?: string;
  id?:number;
  actionHaandler?:string;
}
export interface Validator {
  name: string;
  validator: any;
  message: string;
}
export interface Properties {
  label: string,
  name: string,
  id?: string,
  placeHolder?: string,
  disable?: boolean,
  value?:any,
  styles?: styleConfig,
  options?:optionMap[],
  minDate?: Date,
  maxDate?: Date,
}
export interface optionMap {
  label: string,
  value: any
}
export interface optionConfiguration {
  isMultiSelect?: boolean,
  isPagable?: boolean,
  isVirtualScroll?: boolean,
  dataProvider?: string  
}
export interface styleConfig {
  isHighlight?:boolean,
  isHidden?: boolean
}
export interface fieldHandling {
  fieldHandler?: string,
  enableFields?: string[],
  disableFields?: string[]
}
export interface eventHandling {
  eventHandler?: string,
  enableFields?: string[],
  disableFields?: string[]
}
export interface expressionOnChangeRules {
  dependentFields?: string[],
  eventHandling?: eventHandling,
  fieldHandling?: fieldHandling[]
}
export interface expressionProperties {

}
export interface FieldConfig {
  key:string,
  type: string,
  templateOptions: Properties,
  validationRules?: Validator[],
  optionConfiguration?: optionConfiguration,
  expressionPropertiesT ?: expressionOnChangeRules,
  expressionProperties?: {}
} 

export interface ActionsConfig{
  type?: string,
  label?: string,
  actionType?: string,
  actionHandler?: string
}

export interface FormConfigurations {
  name: FormGroup,
  fields: FieldConfig[],
  actions: ActionsConfig[]
}