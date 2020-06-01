export const environment = {
  production: true,
  BFE_API_KEY: 'e7111b44-4343-4b03-9e07-a14da484b5c1',
  OPCO:'ZM',
  regex: "^[0-9]{6,9}$",
  loginTypePattern:"Accept only Numbers having length between 6 to 9",
  userManagementBaseUrl:"http://172.27.146.167:30045/#/",
  caseManagementBaseURL:"http://172.27.146.167:30043/#/",
  geoLocationConfiguration: [
    {
      label:'Zone',
      key:'id_zone',
      order: 1
    }, 
    {
      label:'Territory',
      key:'id_territory',
      order: 2
    },
    {
      label:'Cluster',
      key:'id_cluster',
      order: 3
    }
  ]
}; 