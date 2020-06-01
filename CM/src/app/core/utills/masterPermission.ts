export const ApplicationFunctionalities = [
    {
        name: "ROLES",
        moduleName:"role",
        default:false,
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
    },
    {
        name: "CM",
        moduleName:"case-management",
        default:true,
        isExternal:false,
        permission: [     
            {
                id:25,
                permissionName: "case_management"
            },                 
            {
                id:28,
                permissionName: "list_available_agents"
            },
            {
                id:29,
                permissionName: "availability_status_change"                
            },            
            {
                id:30,
                permissionName: "search_agent"
            },
            {
                id:31,
                permissionName: "drop_case" 
            },            
            {
                id:32,
                permissionName: "listing_of_case"                
            },
            {
                id:33,
                permissionName: "event_watch"                
            },
            {
                id:34,
                permissionName: "create_agent"
            },
            {
                id:26,
                permissionName: "transaction_any"                
            },            
            {
                id:27,
                permissionName: "transaction_specific"
            }
        ]
    }
]

export const PermissionIds = {
    /* Case Management */     
    TRANSACTION_ANY: 26,
    TRANSACTION_SPECIFIC: 27,
    LIST_AVAILABLE_AGENTS: 28,
    AVAILABILITY_STATUS_CHANGE: 29,
    DROP_CASE: 31,
    EVENT_WATCH: 33,
    CREATE_AGENT: 34,
    LISTING_OF_CASE: 32,                
    SEARCH_AGENT: 30,
    CASE_MANAGEMENT: 25
}