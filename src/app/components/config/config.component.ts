import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  providers: [MessageService]
})
export class ConfigComponent implements OnInit {
  sports: string[]
  sportsBooks: string[]
  selectedSports: string[]
  selectedSportsBooks: string[]
  gettingConfig: boolean
  inputUrlSegment: string
  userName: string
  password: string
  constructor( private configService: ConfigService, private messageService: MessageService ) {
    this.sports = []
    this.sportsBooks = []
    this.selectedSports = []
    this.selectedSportsBooks = []
    this.gettingConfig = true
    this.inputUrlSegment = ''
    this.userName = ''
    this.password = ''
    
  }
  setConfig() {
    this.gettingConfig = true
    const body = { sports: this.selectedSports, sportsBooks: this.selectedSportsBooks };
    this.configService.setConfig(body).subscribe({
      next: (data) => {
        this.gettingConfig = false
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
      },
      error: (error) => {
        this.gettingConfig = false
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Error occured. Set correct url.'})
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Observable completed');
      }
    })
  }
  setUrl() {
    localStorage.setItem('urlSegment', this.inputUrlSegment);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Url set.' });
  }
  isLoggedIn () {
    return this.configService.userLoggedIn
  }
  login() {
    const body = { username:  this.userName, password: this.password };
    console.log(body)
    this.configService.login(body).subscribe({
      next: (data) => {
        if (data.success) {
          localStorage.setItem('loggedIn', 'true');
          this.configService.userLoggedIn = true
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful.' });
          this.configService.getConfig().subscribe({
            next: (data) => {
              this.gettingConfig = false
              this.sports = data.sports
              this.sportsBooks = data.sportsBooks
              this.selectedSports = data.selectedSports
              this.selectedSportsBooks = data.selectedSportsBooks
            },
            error: (error) => {
              console.error('Error:', error);
            },
            complete: () => {
              console.log('Observable completed');
            }
          })
        }else {
          this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Wrong username or password.'});
        }
      },
      error: (error) => {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Error occured. Set correct url.'})
        console.error('Error:', error)
      },
      complete: () => {
        console.log('Observable completed');
      }
    })
  }
  ngOnInit(): void {
    if(this.configService.userLoggedIn) {
      this.configService.getConfig().subscribe({
        next: (data) => {
          this.gettingConfig = false
          this.sports = data.sports
          this.sportsBooks = data.sportsbooks
          this.selectedSports = data.sports.filter((sport: any) => sport.selected)
          this.selectedSportsBooks = data.sportsbooks.filter((sportsbook: any) => sportsbook.selected)
        },
        error: (error) => {
          console.error('Error:', error);
        },
        complete: () => {
          console.log('Observable completed');
        }
      })
    }
  }
}
