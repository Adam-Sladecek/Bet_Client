import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { BetsComponent } from './components/bets/bets.component';
import { ConfigComponent } from './components/config/config.component';
import { OpportunityManagementComponent } from './components/opportunity-management/opportunity-management.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', component: BetsComponent},
                    { path: 'config', component: ConfigComponent},
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