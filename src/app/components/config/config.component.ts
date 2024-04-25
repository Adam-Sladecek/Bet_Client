import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfigService } from 'src/app/services/config.service';
import { LoginService } from 'src/app/services/login.service';

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
  
  constructor( private configService: ConfigService, 
    private messageService: MessageService, 
    private router: Router,
    private loginService: LoginService ) {
      this.gettingConfig = true
      this.sports = []
      this.sportsBooks = []
      this.selectedSports = []
    this.selectedSportsBooks = []
    this.inputUrlSegment = ''
  }
  
  ngOnInit(): void {
    if(this.loginService.userLoggedIn) {
      this.getConfig()
      return
    }
    this.router.navigate(['login'])
  }

  setConfig(): void {
    this.gettingConfig = true;
    const body = { sports: this.selectedSports, sportsBooks: this.selectedSportsBooks }
    this.configService.setConfig(body).subscribe({
      next: (data) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message })
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
        console.error(err)
      },
      complete: () => {
        this.gettingConfig = false
      }
    })
  }

  setUrl(): void {
    localStorage.setItem('urlSegment', this.inputUrlSegment)
    this.getConfig();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Url set.' })
  }

  // login() {
  //   const body = { username:  this.userName, password: this.password }
  //   console.log(body)
  //   this.configService.login(body).subscribe({
  //     next: (data) => {
  //       if (data.success) {
  //         localStorage.setItem('loggedIn', 'true');
  //         // this.configService.userLoggedIn = true
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful.' });
  //         this.configService.getConfig().subscribe({
  //           next: (data) => {
  //             this.gettingConfig = false
  //             this.sports = data.sports
  //             this.sportsBooks = data.sportsBooks
  //             this.selectedSports = data.selectedSports
  //             this.selectedSportsBooks = data.selectedSportsBooks
  //           },
  //           error: (error) => {
  //             console.error('Error:', error);
  //           },
  //           complete: () => {
  //             console.log('Observable completed');
  //           }
  //         })
  //       }else {
  //         this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Wrong username or password.'});
  //       }
  //     },
  //     error: (error) => {
  //       this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Error occured. Set correct url.'});
  //       console.error('Error:', error);
  //     },
  //     complete: () => {
  //       console.log('Observable completed');
  //     }
  //   })
  // }

  private getConfig(): void { 
    this.gettingConfig = true
    this.configService.getConfig().subscribe({
      next: (data) => {
        this.sports = data.sports
        this.sportsBooks = data.sportsbooks
        this.selectedSports = data.sports.filter((sport: any) => sport.selected)
        this.selectedSportsBooks = data.sportsbooks.filter((sportsbook: any) => sportsbook.selected)
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
        console.error(err)
      },
      complete: () => {
        this.gettingConfig = false
      }
    })
  }
}
