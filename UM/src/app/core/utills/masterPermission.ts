export const ApplicationFunctionalities = [
    {
        name: "ROLES",
        moduleName:"role",
        default:true,
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
    }
]

export const PermissionIds = {
    /* User Permission Mapping */
    CREATE_USER:1,
    EDIT_USER:2,
    ACTIVATE_USER:3,
    DEACTIVATE_USER:4,
    VIEW_USER_LISTING:5,
    ACTIVE_USER_COUNT:6,
    INACTIVE_USER_COUNT:7,
    BULK_UPLOAD_USER:8,
    DOWNLOAD_USER_BULK_UPLOAD_TEMPLATE:9,
    DOWNLOAD_FAILED_USER_FILE:10,                            
    /* Role Permission Mapping */
    CREATE_ROLE: 11,
    EDIT_ROLE: 12,
    ACTIVATE_ROLE: 13,
    DEACTIVATE_ROLE: 14,
    VIEW_ROLE_LISTING: 15,
    ROLE_COUNT: 16
}