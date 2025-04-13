import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IConfig } from 'src/app/interfaces/Config/iconfig';
import { IConfigResponse } from 'src/app/interfaces/Config/iconfig-response';
import { ConfigService } from 'src/app/services/config.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  providers: [ConfigService, MessageService]
})
export class ConfigComponent implements OnInit {
  sports: IConfig[]
  sportsbooks: IConfig[]
  defaultSportsbooks: IConfig[]
  selectedSports: IConfig[]
  selectedSportsbooks: IConfig[]
  selectedDefaultSportsbook?: IConfig
  gettingConfig: boolean
  updating: boolean
  
  constructor( private configService: ConfigService, 
    private messageService: MessageService,
    private websocketService: WebSocketService ) {
    this.updating = false
    this.gettingConfig = true
    this.sports = []
    this.sportsbooks = []
    this.defaultSportsbooks = []
    this.selectedSports = []
    this.selectedSportsbooks = []
  }
  
  ngOnInit(): void {
    this.getConfig()
    this.websocketService.connect()
  }

  setConfig(): void {
    this.updating = true;
    if (!this.selectedDefaultSportsbook) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Please select a default sportsbook." })
      this.updating = false
      return
    }
    const body = { 
      sportsbookIds: this.selectedSportsbooks.map((sportsbook: IConfig) => sportsbook.id), 
      defaultSportsbookId: this.selectedDefaultSportsbook.id, 
      sportIds: this.selectedSports.map((sport: IConfig) => sport.id)
    }
    this.configService.setConfig(body).subscribe({
      next: (data: IConfigResponse) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Config set." })
        this.websocketService.sendMessage({ action: "update_sportsbooks"})
        this.websocketService.sendMessage({ action: "update_sports"})
        this.updating = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
        console.error(err)
        this.updating = false
      }
    })
  }

  private getConfig(): void { 
    this.gettingConfig = true
    this.configService.getConfig().subscribe({
      next: (data: IConfigResponse) => {
        this.mapConfigResponse(data)
        this.gettingConfig = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
        console.error(err)
      }
    })
  }

  private mapConfigResponse(data: IConfigResponse):void {
    this.sports = data.sports
    this.sportsbooks = data.sportsbooks.filter((sportsbook: any) => !sportsbook.is_default)
    this.defaultSportsbooks = data.sportsbooks.filter((sportsbook: any) => sportsbook.is_default)
    this.selectedSports = data.sports.filter((sport: any) => sport.selected)
    this.selectedSportsbooks = data.sportsbooks.filter((sportsbook: any) => sportsbook.selected && !sportsbook.is_default)
    this.selectedDefaultSportsbook = data.sportsbooks.find((sportsbook: any) => sportsbook.is_default && sportsbook.selected)
  }
}
