import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IConfig } from 'src/app/interfaces/Config/iconfig';
import { IConfigResponse } from 'src/app/interfaces/Config/iconfig-response';
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
  defaultSportsbooks: IConfig[]
  selectedSports: IConfig[]
  selectedSportsbooks: IConfig[]
  selectedDefaultSportsbook?: IConfig
  gettingConfig: boolean
  updating: boolean
  
  constructor( private configService: ConfigService, 
    private messageService: MessageService ) {
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
  }

  setConfig(): void {
    this.updating = true;
    var default_sbs: IConfig[] = []
    if (this.selectedDefaultSportsbook) {
      default_sbs = [this.selectedDefaultSportsbook]
    }
    const body = { sports: this.selectedSports, sportsbooks: this.selectedSportsbooks, default_sportsbooks: default_sbs } as IConfigResponse
    this.configService.setConfig(body).subscribe({
      next: (data: IConfigResponse) => {
        this.mapConfigResponse(data)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Config set." })
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
    this.sportsbooks = data.sportsbooks
    this.defaultSportsbooks = data.default_sportsbooks
    this.selectedSports = data.sports.filter((sport: any) => sport.selected)
    this.selectedSportsbooks = data.sportsbooks.filter((sportsbook: any) => sportsbook.selected)
    this.selectedDefaultSportsbook = data.default_sportsbooks.find((sportsbook: any) => sportsbook.selected)
  }
}
