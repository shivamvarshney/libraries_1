export interface EventsType {
  initial?: Events[],
  onchange?: Events[]
}
export interface Events {
  actionDataProvider?: string,
  source?: string,
  destination: string,
  dependent?: string[];
  localstorage?: boolean;
  changeType?:ChangeType[],
  callApi?:boolean,
  onChange?:Events[],
  dependentFields?: string[]
}
interface ChangeType{
  source:any,
  addDestination:[string],
  removeDestination:[string]  
}
export interface Validator {
  name: string;
  validator: any;
  message: string;
}
export interface options {
  label?: string,
  value?: string
}
export interface FieldConfig {
  label?: string;
  name?: string;
  inputType?: string;
  options?: options[];
  collections?: any;
  type: string;
  value?: any;
  validations?: Validator[];
  placeHolder?: string;
  class?: string;
  disabled?: boolean;
  mendatory?: boolean,
  visibility?:boolean,
  dependent?: string[],
  destination?: string,
  localstorage?: boolean,
  onChange?:Events,
  isMultiselect?:boolean,
  optionsData?:boolean,
  clear?:string,
  minDate?:any,
  maxDate?:any,
  buttonType?: string,
  geoConfig?:boolean,
  levelId?:number,
  saveType?:string[]
}
export interface FormDetails {
  class: string;
  name: string;
  id?:number;
  actionHaandler?:string;
}