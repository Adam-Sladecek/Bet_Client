import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { BetsComponent } from './components/bets/bets.component';
import { ConfigComponent } from './components/config/config.component';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { OpportunityManagementComponent } from './components/opportunity-management/opportunity-management.component';
import { TabViewModule } from 'primeng/tabview';
import { OpportunityFactoryComponent } from './components/opportunity-factory/opportunity-factory.component';
import { DropdownModule } from 'primeng/dropdown';
import { OpportunityChildrenComponent } from './components/opportunity-children/opportunity-children.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

import { EventDialogComponent } from './components/bets/event-dialog/event-dialog.component';
import { OpportunityDialogComponent } from './components/bets/opportunity-dialog/opportunity-dialog.component';
import { OpportunityMarketsComponent } from './components/opportunity-markets/opportunity-markets.component';

@NgModule({
  imports: [
    FormsModule,
    AppLayoutModule,
    AppRoutingModule,
    TableModule,
    ButtonModule,
    ProgressSpinnerModule,
    MultiSelectModule,
    ToastModule,
    BrowserAnimationsModule,
    TabViewModule,
    DropdownModule,
    DialogModule,
    InputTextModule,
    InputNumberModule
  ],
  declarations: [
    AppComponent,
    BetsComponent,
    ConfigComponent,
    OpportunityManagementComponent,
    OpportunityFactoryComponent,
    OpportunityChildrenComponent,
    EventDialogComponent,
    OpportunityDialogComponent,
    OpportunityMarketsComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
