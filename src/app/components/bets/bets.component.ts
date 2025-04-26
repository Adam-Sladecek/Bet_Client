import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';

import { WebSocketService } from 'src/app/services/web-socket.service';
import { TaskState } from 'src/app/enums/task-state';
import { IBetResponse } from 'src/app/interfaces/Bet/ibet-response';
import { SocketResponseType } from 'src/app/enums/socket-response-type';
import { ILineResponse, ILine, ILinePrice } from 'src/app/interfaces/Bet/iline-response';
import { EventService } from 'src/app/services/event.service';
import { Movement } from 'src/app/enums/movement';
import { SOCKET_CONSTANTS } from 'src/app/constants/app.constants';

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
    lines: ILine[] = []
    sportsbook_ids: number[] = []
    selectedSportsbookIds: number[] = []; 
    sport_ids: number[] = []
    selectedSportIds: number[] = []; 
    selectedOpportunity: ILine

    kellyMultiplier: number = 1
    parentOdds: number = 0
    childOdds: number = 0
    budget: number = 100
    
    constructor( private websocketService: WebSocketService,
      private messageService: MessageService,
      private eventService: EventService ) {
      this.showEventDialog = false
      this.selectedOpportunity = {} as ILine
      this.triggerEventSubscription = this.websocketService.triggerEventObservable.subscribe({
        next: (response: IBetResponse) => {
          if (response.type == SocketResponseType.SCRAPING){ 
            this.taskState = response.data as TaskState;
            return
          }
          if (response.type == SocketResponseType.MATCHDATA) { 
            this.getLastSignal()
            let matchResponse = response.data as ILineResponse
            this.updateOpportunities(matchResponse)
            return
          }
          if (response.type == SocketResponseType.ERROR) { 
            const err = response.data as string
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err})
          }
        },
        error: (err) => {
          this.error = true
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
        }
      });
    }

    ngOnInit(): void {
      this.websocketService.connect();
    }

    ngOnDestroy(): void {
      this.websocketService.disconnect();
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
      this.websocketService.sendMessage({ action: SOCKET_CONSTANTS.START });
    }
    
    endScrape(): void {
      this.websocketService.sendMessage({ action: SOCKET_CONSTANTS.END });
    }

    open_configuration() { 
      this.showEventDialog = true
    }

    getSbImageRoute(sbId: number): string {
      return this.eventService.getSbImageRoute(sbId);
    }

    getSbName(sbId: number): string {
      return this.eventService.getSbName(sbId);
    }
  
    getSportImageRoute(sportId: number): string {
      return this.eventService.getSportImageRoute(sportId);
    }

    getOddClass(odd: ILinePrice): { [key: string]: boolean } {
      return {
        'movement-up': odd.movement == Movement.UP as number,
        'movement-down': odd.movement == Movement.DOWN as number
      };
    }

    calculateStake(opportunity: ILine): number { 
      return this.kellyMultiplier*opportunity.stake*this.budget
    }

    calculateSelectedStake(): number { 
      if(this.parentOdds == 0) return 0
      const impl_prob = 1/this.parentOdds
      const kelly = impl_prob - (1 - impl_prob)/(this.childOdds-1)
      return this.kellyMultiplier*kelly*this.budget
    }

    setUsedEvent(opportunity: ILine) { 
      this.eventService.setUsedEvent(opportunity.default_event_id, opportunity.sportsbook_id).subscribe({
        next: (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Event set as used." })
          this.websocketService.sendMessage({ action: "update_events" });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
        }
      });
    }

    private getLastSignal() {
      const currentDate = new Date();
      const currentHours = this.padZero(currentDate.getHours());
      const currentMinutes = this.padZero(currentDate.getMinutes());
      const currentSeconds = this.padZero(currentDate.getSeconds());
      this.lastSignal = currentHours + ':' + currentMinutes + ':' + currentSeconds;
    }

    private updateOpportunities(response: ILineResponse) { 
      console.log(response)
      if (response.update_all) { 
        this.lines = response.lines
        return
      }

      this.lines = this.lines.filter(line => 
        response.selected_event_ids.includes(line.regular_event_id) && 
        response.selected_event_ids.includes(line.default_event_id)
      );

      const lineIndexMap = new Map<number, number>();
      response.lines.forEach((line, index) => {
        lineIndexMap.set(line.id, index);
      });

      response.lines.forEach(line => {
        if (!this.sportsbook_ids.includes(line.sportsbook_id)) {
          this.sportsbook_ids.push(line.sportsbook_id)
        }
        if (!this.sport_ids.includes(line.sport_id)) {
          this.sport_ids.push(line.sport_id)
        }

        const existingIndex = lineIndexMap.get(line.id);
        if(existingIndex == undefined) {
          this.lines.push(line)
          return
        }
        this.lines[existingIndex] = line
      });
    }

    private padZero(num: number): string {
      return num < 10 ? '0' + num : num.toString();
    }
  }
  