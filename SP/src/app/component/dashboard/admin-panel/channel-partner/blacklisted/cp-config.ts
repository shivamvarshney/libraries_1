export const CPConfiguration = {
  displayColumnKeys: [
    'user_details',
    'role_details',
    'status'
  ],
  displayColumnHeader: [
    { name: 'user_details', label: 'BVN No' }, 
    { name: 'role_details', label: 'CP Name' },
    { name: 'termination_date', label: 'Termination Date' },
    { name: 'status', label: 'CP Type' }
  ],
  objectColumn:[
    {
      name:'user_details',
      dataColumns:[
        'firstName lastName',
        'auuid',
        'email',        
        'mobileNumber'
      ]
    },
    {
      name:'role_details',
      source:'role',      
      dataColumns:[
        'roleName'        
      ]
    }
  ],
    implementCheckBox: false, 
    filters:
    {
      default: [
        {
          inputType: 'text',
          placeHolder: 'blacklist_search',
          label: '',
          key: 'auuid',
          div_class: 'input-search-box',
          isDropdown:false,
          dropDownValue:''
        }
      ],
      searchButton: false,
      formAction: {
        default: [
          {
            formName: 'defaultAssignedKitForm',
            submitActionHandler: 'submitdefaultAssignedkitform'
          }
        ]
      },
      redirection:['channel-partner','list'],
      queryParams:['roleId']
    },
    listActionInfo: [],
    kitListDataPerPage: [5, 10, 20, 50], 
    listHeader: {
      listTitle: 'users_listing_title',
      backInfo: {
        title: 'back',
        imageName: 'back.svg',
        action: 'backToDashboard',
        redirectionRoute:['channel-partner']
      }
    },
    rootClasses: {
      root: 'users',
      grid: 'user-grid',
      filters: 'user-filters',
      headerTitle: 'user-header',
      showTableHeader:true
    }
  };
  