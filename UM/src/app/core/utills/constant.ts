// All the application constant will be written here
export const AppConstants = {
  // Kit Managment
  // Sameple Template Name
  sampleKitTemplate:"KitsSample.csv",
  sampleUserTemplate:"UsersSample.csv",
  createRoleLevel:"Level",
  opco: 'NG',  
  serviceId: 'snd_user_mngt_service_app',
  opcoConfig: {
    patternNum: /^[0-9]*$/,
    namePattern: /^[a-zA-Z \-\']+/,
    dobpattern: /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/, // format = mm/dd/yyyy
    currencyCode: 'UG',
    numberLength: 10,
    opcode: '234',
    min: 3,
    auuidMax: 10,
    msisdnMax: 10,
    nationalIdMax: 20,
    otpMaxLength: 4,
    maxAuuidMsisdnLength: 11,
    minAuuidMsisdnLength: 11,
  }
};
