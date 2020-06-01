/* Code for Upload in bfe 1.0
let uploadRef = "/upload";
location /upload/{
    proxy_pass https://172.23.12.145/ngpsb/zuul/bfe/web/sales/api/;
}
*/
import { environment } from '@environment/environment';
let apiRef = "/api";
let loginRef = "/app";
let logoutRef = "/logout";
let cpapiRef = "/cpmservices";

// BFE
// let apiRef = "http://172.24.35.204:30021/bfe/web/userm/api";
// let loginRef = "http://172.24.35.204:30021/bfe/web/auth/app";
// let logoutRef = "http://172.24.35.204:30021/bfe/api/v1/user";
// let cpapiRef = "http://172.24.35.204:30021/bfe/web/cpmservices/api";

//BackendTEam API connection for ZM
// let apiRef = "https://bfeuat.airtel.co.zm/bfe/web/userm/api";
// let loginRef = "https://bfeuat.airtel.co.zm/bfe/web/auth/api/user-mngmnt/v2";
// let logoutRef = "http://172.27.146.167:30013/v1/user";
// let cpapiRef = "https://bfeuat.airtel.co.zm/bfe/web/cpmservices/api";


export const apiUrls = {
 opco: environment.OPCO,
 logout: logoutRef+"/logout",
 getMasterData: apiRef+"/user-mngmnt/v1/getMasterData",
 login:loginRef+"/login", 
 user: apiRef + "/user-mngmnt/users",
 verifyUser:apiRef+"/user-mngmnt/verifyUser",
 masterPermissions: apiRef+"/user-mngmnt/v1/permissions",
 permissions: apiRef + "/user-mngmnt/v1/permissions",
 sendOTP: apiRef+"/user-mngmnt/send-otp",
 resendOTP: apiRef+"/user-mngmnt/resend-otp",
 getGeoDefinition: apiRef+"/user-mngmnt/v1/user/getGeoDefinition",
 getGeoLocationData: apiRef+"/user-mngmnt/v1/user/getSiteDefinition",
 downloadFile: apiRef+"/user-mngmnt/v1/user-download-file",
 bulkUploadFile: apiRef+"/user-mngmnt/v1/upload-users",
 userList: apiRef+"/user-mngmnt/v2/user/search",
 toggleUser: apiRef+"/user-mngmnt/v2/user/setStatus",
 cpCount: cpapiRef+"/cpm/entity/entityCount",
 cpUploadFile: cpapiRef+"/cpm/bulkUpload",
 cpDownloadSampleFile: cpapiRef+"/cpm/bulkUpload/download-sample"

};
