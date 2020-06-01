export const CPPermission = {
    id: 1,
    name: 'Users',
    granted: true,
    permissions: [
        {
            id: 1,
            name: 'Active User',
            granted: false
        },
        {
            id: 2,
            name: 'Inactive User',
            granted: true
        },
        {
            id: 3,
            name: 'Create Operate Users',
            granted: true
        },
        {
            id: 4,
            name: 'Bulk Upload',
            granted: true
        },
        {
            id: 5,
            name: 'Edit User',
            granted: true
        },
        {
            id: 6,
            name: 'Delete User',
            granted: true
        },
        {
            id: 7,
            name: 'View Users',
            granted: false
        },
        {
            id: 8,
            name: 'Dashboard',
            granted: true
        },
        {
            id: 9,
            name: 'Deactivate Users',
            granted: true
        }
    ]
}