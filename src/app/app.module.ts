import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { BetsComponent } from './components/bets/bets.component';
import { ConfigComponent } from './components/config/config.component';
import { WebSocketService } from './services/web-socket.service';
import { ConfigService } from './services/config.service';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { OpportunityManagementComponent } from './components/opportunity-management/opportunity-management.component';
import { TabViewModule } from 'primeng/tabview';
import { OpportunityFactoryComponent } from './components/opportunity-factory/opportunity-factory.component';
import { OpportunityLinksComponent } from './components/opportunity-links/opportunity-links.component';
import { DropdownModule } from 'primeng/dropdown';
import { OpportunityChildrenComponent } from './components/opportunity-children/opportunity-children.component';
import { DialogModule } from 'primeng/dialog';
import { EventDialogComponent } from './components/bets/event-dialog/event-dialog.component';
import { OpportunityDialogComponent } from './components/bets/opportunity-dialog/opportunity-dialog.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppLayoutModule,
    AppRoutingModule,
    TableModule,
    InputNumberModule,
    ButtonModule,
    ProgressSpinnerModule,
    InputTextModule,
    MultiSelectModule,
    ToastModule,
    SliderModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TabViewModule,
    DropdownModule,
    DialogModule
  ],
  declarations: [
    AppComponent,
    BetsComponent,
    ConfigComponent,
    OpportunityManagementComponent,
    OpportunityFactoryComponent,
    OpportunityLinksComponent,
    OpportunityChildrenComponent,
    EventDialogComponent,
    OpportunityDialogComponent,
  ],
  providers: [
    WebSocketService, 
    ConfigService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
