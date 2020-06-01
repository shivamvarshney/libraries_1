// Common function are written over here
export class AppUtills {  
  

  public static showErrorMessage(error){
    let booleanCheck = true;
    if (error && error.status && ((error.status == 401) || (error.status == 403)) && (typeof error.ok == 'boolean' && error.ok == false)) {
      booleanCheck = false;
    }
    return booleanCheck;
  }  
  
  public static getCurrentYear(){
    let date = new Date();    
    return date.getFullYear();
  }
  
  public static getCurrentMonth(){
    let date = new Date();
    return date.getMonth();
  }

  public static getCurrentDay(){
    let date = new Date();
    return date.getDate();
  }

  public static checkIsArray(arr){
    return Array.isArray(arr);
  }
  public static getMaxLevel(obj){
    let max = -1;
    obj.forEach((val,key)=>{
      if(val.level > max){
        max = val.level;
      }
    });
    return max;
  }
  public static getUniqueValueArray(arrayData){
    return arrayData.filter((uniqueVal,uniqueKey)=>
      arrayData.indexOf(uniqueVal) === uniqueKey
    );
  }
  public static removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }
  //prepare Query String
  public static prepareQueryParam(data:any){
    let queryString = '';
    if(Object.keys(data).length > 0){
      Object.keys(data).forEach(function(key) {
        queryString += `${key}=${data[key]}&`;
      });
      if(queryString!=''){
        queryString = queryString.slice(0, -1);
      }
    }
    return queryString;
  }

  // Get user Infor From the session storage
  public static getUserInfo() {
    return JSON.parse(this.getValue('userInfo'));
  }
  // Cancel Transaction and move to Dashboard
  public static getRequestedPhoneNo() {
    let encodedPhoneNo = this.getValue('phoneno');
    let requestedPhoneNo = this.decode(encodedPhoneNo);
    return requestedPhoneNo;
  }
  // Redirect and open in the new Tab
  public static onNavigate(urlInfo: any) {
    window.open(urlInfo, '_self');
  }
  // Get the Unique values
  public static uniqueValues(arrayData: any) {
    return arrayData.filter(function(el: any, index: any, arr: any) {
      return index == arr.indexOf(el);
    });
  }
  // Remove Value by Key
  public static removeValue(storageKey: any) {
    sessionStorage.removeItem(storageKey);
    //localStorage.removeItem(storageKey);
    return true;
  }
  // Set Value, by passing key and value
  public static setValue(key: any, value: any) {
    sessionStorage.setItem(key, value);
    //localStorage.setItem(key, value);
    return true;
  }
  // Get value, by passing key
  public static getValue(key: any) {
    return sessionStorage.getItem(key);
    //return localStorage.getItem(key);
  }
  // Clear localStorage
  public static removeValues() {
    sessionStorage.clear();
    //localStorage.clear();
    return true;
  }
  // Base64 Encoded Value
  public static encode(data: any) {
    let encodedString = window.btoa(data);
    return encodedString;
  }
  // Base64 Decoded Value
  public static decode(data: any) {
    let decodedString = window.atob(data);
    return decodedString;
  }
}
