import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Bets', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Configuration', icon: 'pi pi-fw pi-cog', routerLink: ['/config'] },
                    { label: 'Opportunity management', icon: 'pi pi-fw pi-sort-alt', routerLink: ['/opportunities'] },
                ]
            }
        ];
    }
}
