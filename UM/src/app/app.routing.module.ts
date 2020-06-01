import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { AuthNGuard } from '@src/auth/authn.guard';
import { ModulePreloadingStrategy } from './module-preloading-strategy';
import { AuthZGuard } from './auth/authz.guard'; 
import { ExternalZGuard } from './auth/external.guard';
 
const OPEN_ROUTES = [
  {
    path: "",
    loadChildren: './component/login/login.module#LoginModule'
  }
];
const SECURED_ROUTES = [
  {
    path: '', 
    canActivate: [ExternalZGuard,AuthNGuard],
    component: DashboardComponent,
    children: [       
      {
        path: 'user',
        canActivate:[AuthZGuard],
        loadChildren: './component/dashboard/admin-panel/user-management/user.module#UserModule',
        data: { label:'USERS' }
      },
      {
        path: 'role',
        canActivate:[AuthZGuard],
        loadChildren: './component/dashboard/admin-panel/role-management/role.module#RoleModule',
        data: { preload: true,label:'ROLES' }
      }
    ]
  },
  {
    path:'unauthorized-page',
    component:PageNotFoundComponent
  },
  {
    path: "**",
    component: PageNotFoundComponent
  }
];
const routes: Routes = [
  {
    path: '',
    children: [
      ...OPEN_ROUTES
    ]
  },
  {
    path: '',
    children: [
      ...SECURED_ROUTES,
    ],
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: ModulePreloadingStrategy })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const APP_ROUTES_MODULE_PROVIDER = [ModulePreloadingStrategy];
