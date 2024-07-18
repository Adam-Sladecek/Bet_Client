import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { TaskState } from 'src/app/enums/task-state';
import { MessageService } from 'primeng/api';
import { IEventModel } from 'src/app/interfaces/Event/ievent-model';
import { IBetResponse } from 'src/app/interfaces/Bet/ibet-response';
import { SocketResponseType } from 'src/app/enums/socket-response-type';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss'],
  providers: [MessageService]
})
export class BetsComponent implements OnInit{
    private triggerEventSubscription: Subscription
    private taskState!: TaskState
    lastSignal?: string
    error!: boolean
    showEventDialog: boolean
    
    constructor( private websocketService: WebSocketService,
      private messageService: MessageService ) {
      this.showEventDialog = false
      this.triggerEventSubscription = this.websocketService.triggerEventObservable.subscribe({
        next: (response: IBetResponse) => {
          if (response.type == SocketResponseType.STATERESPONSE){ 
            this.taskState = response.data as TaskState;
            return
          }
          if (response.type == SocketResponseType.MATCHDATA) { 
            this.getLastSignal()
            return
          }
        },
        error: (err) => {
          this.error = true
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
        }
      });
    }

    ngOnInit(): void {
      this.websocketService.connect();
    }

    ngOnDestroy(): void {
      this.triggerEventSubscription.unsubscribe();
    }

    appRunning(): boolean { 
      return this.taskState == TaskState.RUNNING
    }

    endingScrape(): boolean { 
      return this.taskState == TaskState.ENDING
    }
    
    disable_buttons(): boolean { 
      return !this.taskState || this.endingScrape()
    }
    
    startScrape(): void {
      this.websocketService.sendMessage({ action: 'start' });
    }
    
    endScrape(): void {
      this.taskState = TaskState.ENDING;
      this.websocketService.sendMessage({ action: 'end' });
    }

    open_configuration() { 
      this.showEventDialog = true
    }

    private getLastSignal() {
      const currentDate = new Date();
      const currentHours = this.padZero(currentDate.getHours());
      const currentMinutes = this.padZero(currentDate.getMinutes());
      const currentSeconds = this.padZero(currentDate.getSeconds());
      this.lastSignal = currentHours + ':' + currentMinutes + ':' + currentSeconds;
    }

    private padZero(num: number): string {
      return num < 10 ? '0' + num : num.toString();
    }
  }
  