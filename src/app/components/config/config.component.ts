import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IConfigResponse, IConfig } from 'src/app/interfaces/iconfigresponse';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  providers: [ConfigService, MessageService]
})
export class ConfigComponent implements OnInit {
  sports: IConfig[]
  sportsbooks: IConfig[]
  selectedSports: IConfig[]
  selectedSportsbooks: IConfig[]
  gettingConfig: boolean
  inputUrlSegment: string
  
  constructor( private configService: ConfigService, 
    private messageService: MessageService ) {
    this.gettingConfig = true
    this.sports = []
    this.sportsbooks = []
    this.selectedSports = []
    this.selectedSportsbooks = []
    this.inputUrlSegment = ''
  }
  
  ngOnInit(): void {
    this.getConfig()
  }

  setConfig(): void {
    this.gettingConfig = true;
    const body = { sports: this.selectedSports, sportsbooks: this.selectedSportsbooks } as IConfigResponse
    this.configService.setConfig(body).subscribe({
      next: (data: IConfigResponse) => {
        this.mapConfigResponse(data)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Config set." })
        this.gettingConfig = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
        console.error(err)
        this.gettingConfig = false
      }
    })
  }

  setUrl(): void {
    localStorage.setItem('urlSegment', this.inputUrlSegment)
    this.getConfig();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Url set.' })
  }

  private getConfig(): void { 
    this.gettingConfig = true
    this.configService.getConfig().subscribe({
      next: (data: IConfigResponse) => {
        this.mapConfigResponse(data)
        this.gettingConfig = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
        console.error(err)
        this.gettingConfig = false
      }
    })
  }

  private mapConfigResponse(data: IConfigResponse):void {
    this.sports = data.sports
    this.sportsbooks = data.sportsbooks
    this.selectedSports = data.sports.filter((sport: any) => sport.selected)
    this.selectedSportsbooks = data.sportsbooks.filter((sportsbook: any) => sportsbook.selected)
  }
}
