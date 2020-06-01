import { searchData } from '../aaf-grid/search-kit-data';
import { environment } from '@environments/environment';

// Common function are written over here
export class AppUtills {

  public static prepareCaseGeoHierarchy(geoVal,geoData){    
    let geoMasterData = this.getSelectedLevelHierarchy(geoVal.levelHierarchy.levelId);
    let nodeKey = this.nodeKeyStructure(geoVal.id,geoVal.levelName);
    let updatedGeoData = this.createOrUpdateGeoLevelNode(geoMasterData[0].key,geoData,nodeKey);
    if(geoVal.parent && geoVal.parent != null){
      return this.prepareCaseGeoHierarchy(geoVal.parent,updatedGeoData);
    }else{
      return updatedGeoData;
    }
  }

  public static createOrUpdateGeoLevelNode(levelId,geoData,nodeKey){
    if(geoData[levelId]){
      let isInserted = true;
      geoData[levelId].map(geoKey=>{
        if(geoKey.id == nodeKey.id){
          isInserted = false;
        }
      });
      if(isInserted){
        geoData[levelId].push(nodeKey);
      }
    }else{
      geoData[levelId] = [];
      geoData[levelId].push(nodeKey);
    }
    return geoData;
  }
  
  public static nodeKeyStructure(id,label){
    return { id: id, label: label };
  }  

  public static getSelectedLeafHierarchy(levelHierarchy, lookUpParam) {
    let levelId = levelHierarchy[0].order;
    let shopKeys = Object.keys(lookUpParam);
    if (shopKeys.indexOf(levelHierarchy[0].key) != -1) {
      let ids = [];
      if(lookUpParam[levelHierarchy[0].key].constructor.name == 'Array'){
        lookUpParam[levelHierarchy[0].key].map(id => {
          ids.push(id);
        });
      }else{
        ids.push(lookUpParam[levelHierarchy[0].key]);
      }
      return ids;
    } else {
      let nextLevelId = levelId - 1;
      let nextLevelHierarchy = AppUtills.getSelectedLevelHierarchy(nextLevelId);
      return this.getSelectedLeafHierarchy(nextLevelHierarchy, lookUpParam);
    }
  }

  public static getGeoHierarchy() {
    return environment.geoLocationConfiguration;
  }

  public static getLowestGeoHierarchyLabelId() {
    let getGeoHierarchy = this.getGeoHierarchy();
    let lowestId = 1;
    getGeoHierarchy.map(geoV => {
      if (geoV.order > lowestId) {
        lowestId = geoV.order;
      }
    });
    return lowestId;
  }

  public static getLowestGeoHierarchy() {
    let leastLabelId = this.getLowestGeoHierarchyLabelId();
    return this.getSelectedLevelHierarchy(leastLabelId);
  }

  public static getSelectedLevelHierarchy(levelId) {
    let getGeoHierarchy = this.getGeoHierarchy();
    let filteredData = getGeoHierarchy.filter((geoV, geoK) => {
      return geoV.order == levelId ? geoV : '';
    });
    return filteredData;
  }

  public static getSelectedLevelKeyHierarchy(levelKey) {
    let getGeoHierarchy = this.getGeoHierarchy();
    let filteredData = getGeoHierarchy.filter((geoV, geoK) => {
      return geoV.key == levelKey ? geoV : '';
    });
    return filteredData;
  }

  public static showErrorMessage(error) {
    let booleanCheck = true;
    if (error && error.status && ((error.status == 401) || (error.status == 403)) && (typeof error.ok == 'boolean' && error.ok == false)) {
      booleanCheck = false;
    }
    return booleanCheck;
  }

  public static filterRegion(regionsObj, regionId) {
    return regionsObj.filter(value => {
      return value.id == regionId ? value : '';
    });
  }

  public static aggregatorUpdateGeoLocation(geoLocationApiResp, caseObject) {
    let regionInfo = [];
    geoLocationApiResp.map((data, key) => {
      regionInfo.push({ id: data.id, level: data.levelName });
    });
    let updatedCaseObj = caseObject.info.outlets.id_addShop.map((shopInfo, shopKey) => {
      let regionDetail = this.filterRegion(regionInfo, shopInfo.id_region);
      if (regionDetail.length > 0) {
        caseObject.info.outlets.id_addShop[shopKey].id_region = regionDetail[0].level;
      }
    });
    if (caseObject.previousInfo && caseObject.previousInfo.outlets && caseObject.previousInfo.outlets.id_addShop && caseObject.previousInfo.outlets.id_addShop.length > 0) {
      let previoisUpdatedCaseObj = caseObject.previousInfo.outlets.id_addShop.map((p_shopInfo, p_shopKey) => {
        let regionDetail = this.filterRegion(regionInfo, p_shopInfo.id_region);
        if (regionDetail.length > 0) {
          caseObject.previousInfo.outlets.id_addShop[p_shopKey].id_region = regionDetail[0].level;
        }
      });
    }
    return caseObject;
  }

  public static OutLetGeoLocations(geoLocationApiResp, caseObject) {
    let siteDataObj = [];
    let allKeys = Object.keys(geoLocationApiResp);
    allKeys.map((siteInfoValue, geoKey) => {
      let dats = geoLocationApiResp[siteInfoValue];
      dats.map((geoInfo, siteKeyId) => {
        if (geoInfo.leafNodeId) {
          let id_lga = '';
          let id_state = '';
          let id_smfTerritory = '';
          let id_area = '';
          let id_territory = '';
          let id_zone = '';
          let id_region = '';
          if (geoInfo.leafNodeHierarchyType.name == 'Administrative Geographical Hierarchy') {
            id_lga = geoInfo.leafNodeId.levelName ? geoInfo.leafNodeId.levelName : '';
            id_state = geoInfo.leafNodeId.parent ? (geoInfo.leafNodeId.parent.levelName ? geoInfo.leafNodeId.parent.levelName : '') : '';
          } else {
            id_smfTerritory = geoInfo.leafNodeId.levelCode ? geoInfo.leafNodeId.levelCode : '';
            id_territory = geoInfo.leafNodeId.levelName ? geoInfo.leafNodeId.levelName : '';
            id_area = geoInfo.leafNodeId.parent ? (geoInfo.leafNodeId.parent.levelName ? geoInfo.leafNodeId.parent.levelName : '') : '';
            id_zone = geoInfo.leafNodeId.parent ? (geoInfo.leafNodeId.parent.parent ? (geoInfo.leafNodeId.parent.parent.levelName ? geoInfo.leafNodeId.parent.parent.levelName : '') : '') : '';
            id_region = geoInfo.leafNodeId.parent ? (geoInfo.leafNodeId.parent.parent ? (geoInfo.leafNodeId.parent.parent.parent ? (geoInfo.leafNodeId.parent.parent.parent.levelName ? geoInfo.leafNodeId.parent.parent.parent.levelName : '') : '') : '') : '';
          }
          let finalOutput = this.checkSiteIdExist(geoInfo.siteId, siteDataObj);
          if (finalOutput.findCheck) {
            siteDataObj[finalOutput.indexVal].id_smfTerritory = id_smfTerritory;
            siteDataObj[finalOutput.indexVal].id_territory = id_territory;
            siteDataObj[finalOutput.indexVal].id_area = id_area;
            siteDataObj[finalOutput.indexVal].id_zone = id_zone;
            siteDataObj[finalOutput.indexVal].id_region = id_region;
          } else {
            let obj = {
              siteId: geoInfo.siteId,
              id_lga: id_lga,
              id_state: id_state
            }
            siteDataObj.push(obj);
          }
        }
      });
    });
    let updatedCaseObj = caseObject.info.outlets.id_addShop.map((shopInfo, shopKey) => {
      let siteDataObjInfo = this.checkSiteIdExist(shopInfo.id_cpSiteId, siteDataObj);
      caseObject.info.outlets.id_addShop[shopKey].id_region = siteDataObj[siteDataObjInfo.indexVal]['id_region'];
      caseObject.info.outlets.id_addShop[shopKey].id_area = siteDataObj[siteDataObjInfo.indexVal]['id_area'];
      caseObject.info.outlets.id_addShop[shopKey].id_territory = siteDataObj[siteDataObjInfo.indexVal]['id_territory'];
      caseObject.info.outlets.id_addShop[shopKey].id_zone = siteDataObj[siteDataObjInfo.indexVal]['id_zone'];
      caseObject.info.outlets.id_addShop[shopKey].id_lga = siteDataObj[siteDataObjInfo.indexVal]['id_lga'];
      caseObject.info.outlets.id_addShop[shopKey].id_state = siteDataObj[siteDataObjInfo.indexVal]['id_state'];
      caseObject.info.outlets.id_addShop[shopKey].id_smfTerritory = siteDataObj[siteDataObjInfo.indexVal]['id_smfTerritory'];
    });
    if (caseObject.previousInfo && caseObject.previousInfo.outlets && caseObject.previousInfo.outlets.id_addShop && caseObject.previousInfo.outlets.id_addShop.length > 0) {
      let previousCaseObj = caseObject.previousInfo.outlets.id_addShop.map((p_shopInfo, p_shopKey) => {
        let siteDataObjInfo = this.checkSiteIdExist(p_shopInfo.id_cpSiteId, siteDataObj);
        caseObject.previousInfo.outlets.id_addShop[p_shopKey].id_region = siteDataObj[siteDataObjInfo.indexVal]['id_region'];
        caseObject.previousInfo.outlets.id_addShop[p_shopKey].id_area = siteDataObj[siteDataObjInfo.indexVal]['id_area'];
        caseObject.previousInfo.outlets.id_addShop[p_shopKey].id_territory = siteDataObj[siteDataObjInfo.indexVal]['id_territory'];
        caseObject.previousInfo.outlets.id_addShop[p_shopKey].id_zone = siteDataObj[siteDataObjInfo.indexVal]['id_zone'];
        caseObject.previousInfo.outlets.id_addShop[p_shopKey].id_lga = siteDataObj[siteDataObjInfo.indexVal]['id_lga'];
        caseObject.previousInfo.outlets.id_addShop[p_shopKey].id_state = siteDataObj[siteDataObjInfo.indexVal]['id_state'];
        caseObject.previousInfo.outlets.id_addShop[p_shopKey].id_smfTerritory = siteDataObj[siteDataObjInfo.indexVal]['id_smfTerritory'];
      });
    }
    return caseObject;
  }

  public static checkSiteIdExist(siteId, arrayData) {
    let find = false;
    let indexCount = 0;
    arrayData.map((siteInfo, siteKey) => {
      if (siteInfo.siteId == siteId) {
        find = true;
        indexCount = siteKey;
      }
    });
    return { findCheck: find, indexVal: indexCount };
  }

  public static getUTCTimeStamp(timeObj) {
    console.log(timeObj);
    let cDate = new Date(timeObj);
    let cfy = cDate.getUTCFullYear();
    let cmo = cDate.getUTCMonth() + 1;
    let cd = cDate.getUTCDate();
    let ch = cDate.getUTCHours();
    let cmi = cDate.getUTCMinutes();
    let cs = cDate.getUTCSeconds();
    let cMs = cDate.getUTCMilliseconds();
    let finalString = cfy + '-' + cmo + '-' + cd + ' ' + ch + ':' + cmi + ':' + cs + '.' + cMs;
    console.log('finalString is ', finalString, ' and ', new Date(finalString))
    return new Date(finalString);
  }

  public static getCurrentTimeInUTC() {
    let cDate = new Date();
    let cfy = cDate.getUTCFullYear();
    let cmo = cDate.getUTCMonth() + 1;
    let cd = cDate.getUTCDate();
    let ch = cDate.getUTCHours();
    let cmi = cDate.getUTCMinutes();
    let cs = cDate.getUTCSeconds();
    let cMs = cDate.getUTCMilliseconds();
    let finalString = cfy + '-' + cmo + '-' + cd + ' ' + ch + ':' + cmi + ':' + cs + '.' + cMs;
    console.log('finalString is ', finalString, ' and ', new Date(finalString))
    return new Date(finalString);
  }

  public static checkUserType(caller) {
    if (this.getValue('user_actor_type') == caller) {
      return true;
    }
    return false;
  }

  public static checkIsArray(arr) {
    return Array.isArray(arr);
  }
  public static getMaxLevel(obj) {
    let max = -1;
    obj.forEach((val, key) => {
      if (val.level > max) {
        max = val.level;
      }
    });
    return max;
  }
  public static getMinLevel(obj) {
    let min = 5000;
    obj.forEach((val, key) => {
      if (val.level < min) {
        min = val.level;
      }
    });
    return min;
  }
  public static checkReportsToNullRole(obj) {
    let returnBoolean: boolean = false;
    obj.forEach((val, key) => {
      if (val.level && val.level != '' && val.level != null) {

      } else {
        returnBoolean = true;
      }
    });
    return returnBoolean;
  }
  public static getUniqueValueArray(arrayData) {
    return arrayData.filter((uniqueVal, uniqueKey) =>
      arrayData.indexOf(uniqueVal) === uniqueKey
    );
  }
  public static removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }
  //prepare Query String
  public static prepareQueryParam(data: any) {
    let queryString = '';
    if (Object.keys(data).length > 0) {
      Object.keys(data).forEach(function (key) {
        queryString += `${key}=${data[key]}&`;
      });
      if (queryString != '') {
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
    return arrayData.filter(function (el: any, index: any, arr: any) {
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
  public static getDate(dateObject) {
    let dateInfo = new Date(dateObject);
    let a_date = dateInfo.getDate();
    return a_date > 9 ? a_date : '0' + a_date;
  }
  public static getMonth(dateObject) {
    let dateInfo = new Date(dateObject);
    let a_month = dateInfo.getMonth() + 1;
    return a_month > 9 ? a_month : '0' + a_month;
  }
  public static getYear(dateObject) {
    let dateInfo = new Date(dateObject);
    return dateInfo.getFullYear();
  }
  public static prepareHifunDateFormat(year, month, date) {
    return year + '-' + month + '-' + date;
  }

  public static removeDuplicateObject(array, prop) {
    let newArray = [];
    let prepareObj = {};

    for (let i in array) {
      prepareObj[array[i][prop]] = array[i];
    }
    for (let i in prepareObj) {
      newArray.push(prepareObj[i]);
    }
    return newArray;
  }
}
