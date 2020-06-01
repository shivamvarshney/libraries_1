export const environment = {
  production: true,
  BFE_API_KEY: '744abc12-5ecb-4423-8a91-04f49c6efde7',
  OPCO:'NG',
  regex: "^[0-9]{6,10}$",
  loginTypePattern:"Accept only Numbers having length between 6 to 10",
  userManagementBaseUrl:"http://172.24.35.204:30045/#/",
  caseManagementBaseURL:"http://172.24.35.204:30043/#/",
  geoLocationConfiguration: [
    {
      label:'Opco',
      key:'id_opco',
      order: 1
    },
    {
      label:'Region',
      key:'id_region',
      order: 2
    },
    {
      label:'Zone',
      key:'id_zone',
      order: 3
    },
    {
      label:'Area',
      key:'id_area',
      order: 4
    },
    {
      label:'Territory',
      key:'id_territory',
      order: 5
    }
  ]
}; 