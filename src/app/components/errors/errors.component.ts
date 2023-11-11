import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IError } from 'src/app/interfaces/ierror';
import { ConfigService } from 'src/app/services/config.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss'],
  providers: [MessageService]
})
export class ErrorsComponent implements OnInit {
  errors: IError[]
  gettingErrors: boolean
  constructor( private errorService: ErrorService , private configService: ConfigService, private messageService: MessageService ) {
    this.errors = []
    this.gettingErrors = true
  }
  isLoggedIn () {
    return this.configService.userLoggedIn
  }
  ngOnInit(): void {
    this.errorService.getErrors().subscribe({
      next: (data) => {
        this.gettingErrors = false
        this.errors = data.data
      },
      error: (error) => {
        this.gettingErrors = false
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Error occured. Unable to get errors.'})
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Observable completed');
      }
    })
  }
}
