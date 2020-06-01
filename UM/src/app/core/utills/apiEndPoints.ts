import { environment } from '@environment/environment';
// ALl the API URLs will be written over here

let apiRef = "/api";
let loginRef = "/app";
let logoutRef = "/logout";
let siteMgmntRef = "/siteMgmnt";

// BFE Full API URLS
// let apiRef = "https://bfeuat.airtel.com.ng/bfe/web/userm/api";
// let loginRef = "https://bfeuat.airtel.com.ng/bfe/web/auth/app";
// let logoutRef = "https://bfeuat.airtel.com.ng/bfe/api/v1/user";
// let siteMgmntRef = "https://bfeuat.airtel.com.ng/bfe/web/sitemgmt/api";


// BFE Full API URLS for KE
// let apiRef = "http://172.23.36.206:30021/bfe/web/userm/api";
// let loginRef = "http://172.23.36.206:30021/bfe/web/auth/app";
// let logoutRef = "http://172.23.36.206:30021/bfe/api/v1/user";
// let siteMgmntRef = "http://172.23.36.206:30021/bfe/web/sitemgmt/api";

// BFE Full API URLS for ZM
// let apiRef = "https://bfeuat.airtel.co.zm/bfe/web/userm/api";
// let loginRef = "https://bfeuat.airtel.co.zm/bfe/web/auth/app";
// let logoutRef = "https://bfeuat.airtel.co.zm/bfe/api/v1/user";
// let siteMgmntRef = "https://bfeuat.airtel.co.zm/bfe/web/sitemgmt/api";

export const apiUrls = {
    opco: environment.OPCO,
    logout: logoutRef + "/",
    getMasterData: apiRef + "/user-mngmnt/v1/getMasterData",
    login: loginRef + "/login",
    user: apiRef +"/user-mngmnt/users",
    verifyUser: apiRef + "/user-mngmnt/verifyUser",
    resetPin: apiRef + "/user-mngmnt/v1/user/reset-pin",
    forgotPin: apiRef + "/user-mngmnt/v1/user/forgot-pin",
    masterPermissions: apiRef + "/user-mngmnt/v1/permissions",
    permissions: apiRef + "/user-mngmnt/v1/permissions",
    roleCount: apiRef + "/user-mngmnt/v1/roles/count",
    roleTypes: apiRef + "/user-mngmnt/v1/role-types",
    loginChannels: apiRef + "/user-mngmnt/v1/login-channels",
    roles: apiRef + "/user-mngmnt/v1/roles",
    saveRole: apiRef + "/user-mngmnt/v1/roles",
    roleList: apiRef + "/user-mngmnt/v1/roles",
    loginModules: apiRef + "/user-mngmnt/v1/login-modules",
    getRoleById: apiRef + "/user-mngmnt/v1/fetchRole",
    saveEditRole: apiRef + "/user-mngmnt/v1/editRole",
    roleMaster: apiRef + "/user-mngmnt/v1/searchRoles",
    roleSearch: apiRef + "/user-mngmnt/v1/role-search",    
    toggleRole: apiRef + "/user-mngmnt/v1/toggleRole",
    sendOTP: apiRef + "/user-mngmnt/send-otp",
    resendOTP: apiRef + "/user-mngmnt/resend-otp",
    //getGeoDefinition: apiRef + "/user-mngmnt/v1/user/getGeoDefinition",
    //getGeoLocationData: apiRef + "/user-mngmnt/v1/user/getSiteDefinition",
    downloadFile: apiRef + "/user-mngmnt/v1/user-download-file",
    bulkUploadFile: apiRef + "/user-mngmnt/v1/upload-users",
    userCreate: apiRef + "/user-mngmnt/v2/user/create",
    userList: apiRef + "/user-mngmnt/v2/user/search",
    updateUser: apiRef + "/user-mngmnt/v2/user-action/updateUser",
    getUserById: apiRef + "/user-mngmnt/v2/user/getUserDetails",
    toggleUser: apiRef + "/user-mngmnt/v2/user/setStatus",
    fetchCount: apiRef + "/user-mngmnt/v1/user/fetchCount",
    clientID: apiRef + "/user-mngmnt/v1/client",
    saleperson: "/kit-services/v1/kits-assign/sales-persons",
    siteSummery: apiRef + "/user-mngmnt/v1/user/site-summery",
    reportingUsers: apiRef + "/user-mngmnt/reporting-users",
    siteLevelHirerchy: siteMgmntRef+"/site-mngmnt/v1/site/level-hierarchy-id",
    siteLists: siteMgmntRef+ "/site-mngmnt/v1/site/siteIdList",
    siteSumary: siteMgmntRef+ "/site-mngmnt/v1/site/site-summary",
    getGeoDefinition: siteMgmntRef+ "/site-mngmnt/v1/site/getGeoDefinition",
    getGeoLocationData: siteMgmntRef+ "/site-mngmnt/v1/site/getSiteDefinition",
    sitesSummary: siteMgmntRef+ "/site-mngmnt/v1/site/siteIdSummaryList"
};
