import { PermissionIds } from '@src/core/utills/masterPermission';

export const RolesConfiguration = {
  gridHeaderConfiguration: {
    mapping: [
      { key: 'role_details', header: '' }
    ],
    gridHeaderFieldKeys: [
      'role_details',
      'actions'
    ],
    multiLineFields: [
      {
        key: 'role_details',
        fields: ['roleName', 'description']
      }
    ],
  },
  gridActionsConfiguration: [
    {
      permissionName: PermissionIds.VIEW_USER_LISTING,
      permissionValidator: 'permissionHandler',
      type: 'quicklink',
      showCase: {
        thumbnail: 'channel-partners.svg',
        label: 'Users',
        key: 'count',
      },
      actionHandler: 'users'
    },
    {
      permissionName: PermissionIds.EDIT_ROLE,
      permissionValidator: 'permissionHandler',
      type: 'button',
      showCase: {
        thumbnail: 'Edit.svg',
        label: 'Edit'
      },
      actionHandler: 'editRole'
    },
    {
      type: 'toggle',
      permissionValidator: 'permissionHandler',
      showCase: {
        key: 'active',
        rules: {
          active: {
            value: true, label: 'Inactivate', permissionName: PermissionIds.DEACTIVATE_ROLE, thumbnail: 'Disable.svg'
          },
          inactive: {
            value: false, label: 'Activate', permissionName: PermissionIds.ACTIVATE_ROLE, thumbnail: 'Disable.svg'
          }
        }
      },
      actionHandler: 'toggleRole'
    }
  ],
  gridFiltersConfiguration: {
    default: {
      strip: {
        inputType: 'text',
        placeHolder: 'Search Role',
        key: 'searchQuery'
      },
      hooks:{
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
  gridStyleConfiguration: {
    rootClasses: {
      pageHeaderClass: 'role',
      gridClass: 'role-grid',
      gridFiltersClass: 'role-filters'
    }
  }
}