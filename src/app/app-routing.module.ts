import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { BetsComponent } from './components/bets/bets.component';
import { HiddenBetsComponent } from './components/hidden-bets/hidden-bets.component';
import { LivebetsComponent } from './components/livebets/livebets.component';
import { ConfigComponent } from './components/config/config.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', component: BetsComponent},
                    { path: 'liveBets', component: LivebetsComponent},
                    { path: 'hidden', component: HiddenBetsComponent},
                    { path: 'config', component: ConfigComponent},
                ]
            },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}