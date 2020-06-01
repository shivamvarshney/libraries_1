export interface cardData{
  card:cardDataType[]
}
export interface cardDataType {
  thumbnail?: string,
  text?: string,
  moduleName?: string
  permissionName?: number,
  count?: countObj,  
  bulk?: bulkObj
}
export interface countObj{
  count?: number ,
  apiCountVariable?: string,
  redirectUrl?: string,
}
export interface bulkObj{
  download:downloadFileObj,
  upload:uploadFileObj
}
export interface downloadFileObj{
  downloadTitle?: string,
  thumbnail?: string,
  downloadURL?: string,
  queryParams?: downloadFileParamsObj[],
  fileType?: string,
  fileName?: string,
  permissionName?: number
}
export interface downloadFileParamsObj{
  key?: string,
  value?: string
}
export interface uploadFileObj{
  errorMessage?: string,
  fileType?: string,
  failedDownload?:failedFileDownloadFileObj,
  queryParams:downloadFileParamsObj[],
  uploadTitle?:string,
  uploadUrl?:string,
  actionLabel?:string
}
export interface failedFileDownloadFileObj{
  permissionName?: number,
  fileType?: string,
  fileName?: string
}