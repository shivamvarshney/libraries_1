import { PermissionIds } from '@src/core/utills/masterPermission';
export const UsersConfiguration = {
  gridActionsConfiguration: [
    {
      permissionName: PermissionIds.EDIT_USER,
      permissionValidator: 'permissionHandler',
      type: 'button',
      showCase: {
        thumbnail: 'Edit.svg',
        label: 'Edit'
      },
      actionHandler: 'editUser'
    },
    {
      type: 'toggle',
      permissionValidator: 'permissionHandler',
      showCase: {
        key: 'status',
        rules: {
          active: {
            value: 'Active', label: 'Inactivate', permissionName: PermissionIds.DEACTIVATE_USER, thumbnail: 'Disable.svg'
          },
          inactive: {
            value: 'Inactive', label: 'Activate', permissionName: PermissionIds.ACTIVATE_USER, thumbnail: 'Disable.svg'
          }
        }
      },
      actionHandler: 'toggleStatus'
    }
  ],
  gridFiltersConfiguration: {
    default: {
      strip: {
        inputType: 'text',
        placeHolder: 'Search User by First Name/MSISDN/AUUID',
        key: 'auuid'
      },
      hooks: {
        onChange: {
          actionHandler: 'handleRedirection',
          value: '',
          data: [
            {
              value: 'all', label: 'ALL'
            },
            {
              value: 'active', label: 'ACTIVE'
            },
            {
              value: 'inactive', label: 'INACTIVE'
            }
          ]
        }
      }
    },
  },  
  gridHeaderConfiguration: {
    mapping: [
      { key: 'user_details', header: 'User Details' },
      { key: 'role', header: 'Roles' },
      { key: 'status', header: 'Status' }
    ],
    gridHeaderFieldKeys: [
      'user_details',
      'role',
      'status',
      'actions'
    ],
    multiLineFields: [
      {
        key: 'role',
        fields: ['roleName']
      },
      {
        key: 'user_details',
        fields: ['firstName lastName', 'auuid', 'email', 'mobileNumber']
      }
    ],
  },
  gridStyleConfiguration: {
    rootClasses: {
      pageHeaderClass: 'role',
      gridClass: 'role-grid',
      gridFiltersClass: 'role-filters'
    }
  }
};
