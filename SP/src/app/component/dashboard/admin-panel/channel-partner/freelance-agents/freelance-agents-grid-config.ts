import { PermissionIds } from '@src/core/utills/masterPermission';

export const freelanceAgentsGridConfig = {	
	gridHeaderConfiguration:{
        mapping:[   
            { key: 'user_details', header: 'User Details' },         
            { key: 'id', header: 'P. Id' },         
            { key: 'firstName lastName', header: 'Name' },                           
            // { key: 'username - client.0.name', header: 'Email Id' },
            { key: 'languageId.name', header: 'Language'},            
            { key: 'client_details', header: 'Clients' },
            // { key: 'mobileNumber', header: 'Mobile No' }
        ],
        gridHeaderFieldKeys:[ 
            'select',  // Whenever we need to show checkBoxes row level, then we need to add this key "AS IN SELECT ONLY"
            'user_details',         
            'id',
            'firstName lastName',
            //'username - client.0.name',
            'languageId.name',            
            'client_details',
            // 'mobileNumber',
            'actions' // Whenever there are actions in the listing page, then we need to add this key "AS IN ACTIONS ONLY"
        ],
        multiLineFields:[
            {
                key:'user_details',
                fields:['firstName lastName','email','mobileNumber','userName']
            },
            {
                key:'client_details',
                fields:['client.0.name']
            }
        ],        
    },
	gridActionsConfiguration:[
        { 
            permissionName: PermissionIds.CHANNEL_PARTNER_BULK_UPLOAD,
            permissionValidator:'permissionHandler',
            type: 'button',
            showCase: {
                thumbnail: 'Edit.svg',            
                label: 'Edit'                
            },            
            actionHandler: 'ACTION_HANDLER'            
        },
        // { 
        //     permissionName: PermissionIds.CHANNEL_PARTNER_BULK_UPLOAD,
        //     permissionValidator:'permissionHandler',
        //     type: 'button',
        //     showCase: {
        //         thumbnail: 'channel-partners.svg',            
        //         label: 'Download'                
        //     },            
        //     actionHandler: 'ACTION_HANDLER'
        // },
        {
            permissionName: PermissionIds.CHANNEL_PARTNER_BULK_UPLOAD,
            permissionValidator:'permissionHandler',
            type: 'quicklink',
            showCase: {
                thumbnail: 'channel-partners.svg',
                label: 'Users',
                key: 'id',
            },
            actionHandler: 'ACTION_HANDLER'
        },
        { 
            permissionName: PermissionIds.EDIT_ROLE,
            permissionValidator:'permissionHandler',
            type: 'button',
            showCase: {
                thumbnail: 'Disable.svg',            
                label: 'Terminate'                
            },            
            actionHandler: 'ACTION_HANDLER'            
        },
        {
            type: 'toggle',
            permissionValidator:'permissionHandler',
            showCase: {
                key: 'status',
                rules:{
                    active:{
                        value: 'Active', label:'Inactivate',permissionName: PermissionIds.DEACTIVATE_USER, thumbnail: 'Disable.svg'
                    },
                    inactive:{
                        value: 'Inactive', label:'Activate', permissionName: PermissionIds.ACTIVATE_USER, thumbnail: 'Disable.svg'
                    }
                }                    
            },
            actionHandler: 'ACTION_HANDLER'
        }
    ],
    gridFiltersConfiguration:{
        default:{
            inputType: 'text',
            placeHolder: 'Search Role by Name and Description',
            key:'role_name'
        },
        // advanced:[        
        //     {
        //         inputType: 'select',
        //         placeHolder: 'Role Status',
        //         key:'role_status',
        //         label: 'Status',
        //         masterData: [
        //             { label: 'Select', value: '' },
        //             { label: 'Active', value: 'active' },
        //             { label: 'InActive', value: 'inactive' }
        //         ]
        //     },
        //     {
        //         inputType: 'text',
        //         placeHolder: 'Assigned User',
        //         label: 'Search User',
        //         key:'role_user',
        //     },
        //     {
        //         inputType: 'text',
        //         placeHolder: 'From Date',
        //         label: 'To Date',
        //         key:'role_from_date',
        //     },
        //     {
        //         inputType: 'text',
        //         placeHolder: 'To Date',
        //         label: 'To Date',
        //         key:'role_to_date',
        //     }
        // ]
    },
    gridAllRowsSelection:{          
        permissionName: PermissionIds.CHANNEL_PARTNER_BULK_UPLOAD,
        permissionValidator:'permissionHandler',            
        showCase: {
            thumbnail: 'channel-partners.svg',            
            label: 'Downlaod Selected',
            subTitle:'.XLS Format'                
        },            
        action:{
            actionHandler:'ACTION_HANDLER'
        }            
    },
	gridStyleConfiguration: {
        rootClasses:{
		    pageHeaderClass: 'role',
		    gridClass: 'role-grid',
            gridFiltersClass: 'role-filters',
            gridSelectAllRowClass:'role-select-all'
        }
    }
}