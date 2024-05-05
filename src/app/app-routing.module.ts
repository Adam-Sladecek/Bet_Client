import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { BetsComponent } from './components/bets/bets.component';
import { HiddenBetsComponent } from './components/hidden-bets/hidden-bets.component';
import { ConfigComponent } from './components/config/config.component';
import { ErrorsComponent } from './components/errors/errors.component';
import { LoginComponent } from './components/login/login.component';
import { OpportunityManagementComponent } from './components/opportunity-management/opportunity-management.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', component: BetsComponent},
                    { path: 'login', component: LoginComponent},
                    { path: 'hidden', component: HiddenBetsComponent},
                    { path: 'config', component: ConfigComponent},
                    { path: 'errors', component: ErrorsComponent},
                    { path: 'opportunities', component: OpportunityManagementComponent},
                ]
            },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}