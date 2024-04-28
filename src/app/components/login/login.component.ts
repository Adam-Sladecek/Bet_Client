import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
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
}
