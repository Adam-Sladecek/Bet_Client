import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {
  password!: string;
  name!: string;
  processing = false

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) { }

  async login() { 
    try {
      this.processing = true
      const result: any = await this.authService.login(this.name, this.password)
      localStorage.setItem('access_token', result.access);
      localStorage.setItem('refresh_token', result.refresh);
      this.router.navigate(['/']);
    }
    catch (err: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
    }
    this.processing = false
  }
}
