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
  sportsBooks: IConfig[]
  selectedSports: IConfig[]
  selectedSportsBooks: IConfig[]
  gettingConfig: boolean
  inputUrlSegment: string
  
  constructor( private configService: ConfigService, 
    private messageService: MessageService ) {
    this.gettingConfig = true
    this.sports = []
    this.sportsBooks = []
    this.selectedSports = []
    this.selectedSportsBooks = []
    this.inputUrlSegment = ''
  }
  
  ngOnInit(): void {
    this.getConfig()
  }

  setConfig(): void {
    this.gettingConfig = true;
    const body = { sports: this.selectedSports, sportsBooks: this.selectedSportsBooks } as IConfigResponse
    this.configService.setConfig(body).subscribe({
      next: (data) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message })
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
        this.sports = data.sports
        this.sportsBooks = data.sportsBooks
        this.selectedSports = data.sports.filter((sport: any) => sport.selected)
        this.selectedSportsBooks = data.sportsBooks.filter((sportsBook: any) => sportsBook.selected)
        this.gettingConfig = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
        console.error(err)
        this.gettingConfig = false
      }
    })
  }
}
