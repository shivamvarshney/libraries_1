export const environment = {
  production: true,
  BFE_API_KEY: 'e4420981-1903-4ea5-a48c-1f3d0a402e01',
  OPCO:'KE',
  regex: "^[0-9]{6,10}$",
  loginTypePattern:"Accept only Numbers having length between 6 to 10",
  userManagementBaseUrl:"http://172.23.36.206:30045/#/",
  caseManagementBaseURL:"http://172.23.36.206:30043/#/",
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