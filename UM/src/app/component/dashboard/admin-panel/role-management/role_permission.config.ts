export const RolePermission = {
    id: 1,
    name: 'Roles',
    granted: true,
    permissions: [
        {
            id: 1,
            name: 'View Roles',
            granted: true
        },
        {
            id: 2,
            name: 'Create Role',
            granted: false
        },
        {
            id: 4,
            name: 'Edit Role',
            granted: false
        },
        {
            id: 5,
            name: 'Delete Role',
            granted: true
        },
        {
            id: 7,
            name: 'Deactivate Roles',
            granted: true
        }
    ]
}