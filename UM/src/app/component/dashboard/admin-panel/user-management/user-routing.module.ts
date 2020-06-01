import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UsersComponent } from './users/users.component';
import { AuthCGuard } from '@src/auth/authc.guard';
import { AuthDGuard } from '@src/auth/authd.guard';
import { AddUserComponent } from './add-user/add-user.component';
import { PermissionIds } from '@src/core/utills/masterPermission';
import { CreateUserComponent } from './create-user/create-user.component';

const routes: Routes = [
  /*{
    path: '', 
    redirectTo: 'panel'
  },*/
  {
    path: '',
    pathMatch:"full",
    //canActivate:[AuthCGuard],
    component: UserDashboardComponent,
    data: { module: 'USERS', label: 'Dashboard' }
  },
  {
    path: 'users',
    children: [
      {
        path: '',
        component: UsersComponent,
        canActivate: [AuthCGuard],
        data: { module: 'USERS', label: PermissionIds.VIEW_USER_LISTING }
      },
      {
        path: ':status',
        component: UsersComponent,
        canActivate: [AuthCGuard],
        data: { module: 'USERS', label: PermissionIds.VIEW_USER_LISTING }
      }
    ]
  },  
  {
    path:'add',
    canActivate: [AuthCGuard],
    canDeactivate: [AuthDGuard],
    component:AddUserComponent,
    data: { module: 'USERS', label: PermissionIds.CREATE_USER }
  },
  {
    path:'add/:id',
    canActivate: [AuthCGuard],
    canDeactivate: [AuthDGuard],
    component:AddUserComponent,
    data: { module: 'USERS', label: PermissionIds.EDIT_USER }
  },
  {
    path:'new',
    component:CreateUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
