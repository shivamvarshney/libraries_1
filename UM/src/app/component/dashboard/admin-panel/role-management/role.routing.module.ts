import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleDashboardComponent } from './role-dashboard/role-dashboard.component';
import { RolesComponent } from './roles/roles.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { AuthCGuard } from '@src/auth/authc.guard';
import { AuthDGuard } from '@src/auth/authd.guard'; 
import { PermissionIds } from '@src/core/utills/masterPermission';

const routes: Routes = [
    /*{ 
        path:'',
        redirectTo:'panel'
    },*/
    { 
        path: '',
        //canActivate:[AuthCGuard],
        component: RoleDashboardComponent,
        data: { module:'Roles',label:'Dashboard' }
    },
    {
        path:'roles',
        children:[
            {
                path:'',
                component:RolesComponent,
                canActivate:[AuthCGuard],
                data: { module:'Roles',label:PermissionIds.VIEW_ROLE_LISTING }
            },
            {
                path:':status',
                component:RolesComponent,
                canActivate:[AuthCGuard],
                data: { module:'Roles',label:PermissionIds.VIEW_ROLE_LISTING }
            }
        ]
    },
    {
        path: 'new',
        canActivate:[AuthCGuard],
        canDeactivate: [AuthDGuard],
        component: CreateRoleComponent,
        data: { module:'Roles',label:PermissionIds.CREATE_ROLE }
    },
    {
        path: 'edit/:id',
        canActivate:[AuthCGuard],
        canDeactivate: [AuthDGuard],
        component: CreateRoleComponent,
        data: { module:'Roles',label:PermissionIds.EDIT_ROLE }
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RoleRoutingModule { }