export const ApplicationFunctionalities = [
    {
        name: "ROLES",
        moduleName:"role",
        default:false,
        isExternal:true,
        permission: [            
            {
                id:11,
                permissionName: "create_role"
            },            
            {
                id:12,
                permissionName: "edit_role"                
            },
            {
                id:13,
                permissionName: "activate_role"                
            },
            {
                id:14,
                permissionName: "deactivate_role"                
            },
            {
                id:15,
                permissionName: "view_role_listing"
            },
            {
                id:16,
                permissionName: "role_count"                
            }
        ]
    },
    {
        name: "USERS",
        moduleName:"user",
        isExternal:true,
        default:false,
        permission: [                                    
            {
                id:1,
                permissionName: "create_user"
            },
                       
            {
                id:2,
                permissionName: "edit_user"                
            },
            {
                id: 3,
                permissionName: "activate_user"
            },
            {
                id: 4,
                permissionName: "deactivate_user"
            },
            {
                id:5,
                permissionName: "view_user_listing"                
            },
            {
                id: 6,
                permissionName: "active_user_count"
            },
            {
                id: 7,
                permissionName: "inactive_user_count"
            },        
            {
                id:8,
                permissionName: "bulk_upload_user"                
            },
            {
                id: 9,
                permissionName: "download_user_bulk_upload_template"
            },
            {
                id: 10,
                permissionName: "download_failed_user_file"
            },
            
        ]
    },
    {
        name: "CP",
        moduleName:"channel-partner",
        default:true,
        isExternal:false,
        permission: [  
            /* Common Permission for All Channel Partner Type Bullk Uploads */                      
            {
                id:18,
                permissionName: "channel_partner_bulk_upload"
            },
            /* Common Permission for All Channel Partner Type Bullk Uploads, to download Sample File */
            {
                id:20,
                permissionName: "download_channel_partner_bulk_upload_template"                
            },
            /* Common Permission for All Channel Partner Type Bullk Uploads, to download Failed Uploaded File */
            {
                id:22,
                permissionName: "download_failed_records_file_of_channel_partner"
            },
            /* Common Permission for All Channel Partner Type Quick Links(Count) */
            {
                id:24,
                permissionName: "channel_partner_count"
            },
            /* Black List Bulk Upload */
            {
                id:19,
                permissionName: "blacklist_bulk_upload" 
            },            
            {
                id:21,
                permissionName: "download_blacklist_bulk_upload_template"                
            },            
            {
                id:23,
                permissionName: "download_failed_records_file_of_blacklist"                
            }            
        ]
    },
    {
        name: "LAUNCHPAD",
        moduleName:"launchpad",
        default:false,
        isExternal:false,
        permission: [  
            /* Common Permission for All Channel Partner Type Bullk Uploads */                      
            {
                id:18,
                permissionName: "channel_partner_bulk_upload"
            },
        ]
    }
]
export const PermissionIds = {
    /* Channel Partner Management */
    /* Generic Permissions for Channel Partners */ 
    CHANNEL_PARTNER_COUNT: 24,
    DOWNLOAD_FAILED_RECORDS_FILE_OF_CHANNEL_PARTNER: 22,
    DOWNLOAD_CHANNEL_PARTNER_BULK_UPLOAD_TEMPLATE: 20,
    CHANNEL_PARTNER_BULK_UPLOAD: 18,
    /* BlckListed Permissions */
    DOWNLOAD_FAILED_RECORDS_FILE_OF_BLACKLIST: 23,    
    DOWNLOAD_BLACKLIST_BULK_UPLOAD_TEMPLATE: 21,    
    BLACKLIST_BULK_UPLOAD: 19,
        
    /* User Permission Mapping */
    INACTIVE_USER_COUNT:7,
    ACTIVE_USER_COUNT:6,
    DOWNLOAD_FAILED_USER_FILE:10,
    DOWNLOAD_USER_BULK_UPLOAD_TEMPLATE:9,
    BULK_UPLOAD_USER:8,
    VIEW_USER_LISTING:5,
    DEACTIVATE_USER:4,
    ACTIVATE_USER:3,
    EDIT_USER:2,
    CREATE_USER:1,
    /* Role Permission Mapping */
    CREATE_ROLE: 11,
    EDIT_ROLE: 12,
    ACTIVATE_ROLE: 13,
    DEACTIVATE_ROLE: 14,
    VIEW_ROLE_LISTING: 15,
    ROLE_COUNT: 16 
}