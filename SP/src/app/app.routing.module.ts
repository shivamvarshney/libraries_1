import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { AuthNGuard } from '@src/auth/authn.guard';
import { ModulePreloadingStrategy } from './module-preloading-strategy';
import { AuthZGuard } from './auth/authz.guard'; 
import { IframesComponent } from './shared/iframes/iframes.component';
 
const OPEN_ROUTES = [
  {
    path: "",
    loadChildren: './component/login/login.module#LoginModule'
  }
];
const SECURED_ROUTES = [
  {
    path: '', 
    canActivate: [AuthNGuard],
    component: DashboardComponent,
    children: [
      {
        path: 'channel-partner',
        canActivate:[AuthZGuard],
        loadChildren: './component/dashboard/admin-panel/channel-partner/cp.module#CPModule',
        data:{ preload: true,label:'CP' }
      },
      {
        path: 'launchpad',
        canActivate:[AuthZGuard],
        loadChildren: './component/dashboard/admin-panel/launchpad/launchpad.module#LaunchpadModule',
        data:{ preload: true,label:'LAUNCHPAD' } // need to change the name
      },
      {
        path: 'external/:type',
        //canActivate:[AuthZGuard],
        component:IframesComponent
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
