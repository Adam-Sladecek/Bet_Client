import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { BetsComponent } from './components/bets/bets.component';
import { ConfigComponent } from './components/config/config.component';
import { OpportunityManagementComponent } from './components/opportunity-management/opportunity-management.component';
import { AuthGuard } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'login', component: LoginComponent },
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', component: BetsComponent, canActivate: [AuthGuard] },
                    { path: 'config', component: ConfigComponent, canActivate: [AuthGuard] },
                    { path: 'opportunities', component: OpportunityManagementComponent, canActivate: [AuthGuard] },
                ]
            },
            { path: '**', redirectTo: '/login' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}