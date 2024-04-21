import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { TableModule } from 'primeng/table';
import { BetsComponent } from './components/bets/bets.component';
import { TagModule } from 'primeng/tag';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { HiddenBetsComponent } from './components/hidden-bets/hidden-bets.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { ConfigComponent } from './components/config/config.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { ErrorsComponent } from './components/errors/errors.component';
import { CardModule } from 'primeng/card';
import { WebSocketService } from './services/web-socket.service';
@NgModule({
  declarations: [
    AppComponent,
    BetsComponent,
    HiddenBetsComponent,
    ConfigComponent,
    ErrorsComponent
  ],
  imports: [
    AppLayoutModule,
    AppRoutingModule,
    TableModule,
    TagModule,
    BrowserModule,
    FormsModule,
    InputNumberModule,
    ButtonModule,
    ProgressSpinnerModule,
    InputTextModule,
    MultiSelectModule,
    ToastModule,
    PasswordModule,
    SliderModule,
    CheckboxModule,
    CardModule
  ],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
