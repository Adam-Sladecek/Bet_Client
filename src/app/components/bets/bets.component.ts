import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';

import { WebSocketService } from 'src/app/services/web-socket.service';
import { TaskState } from 'src/app/enums/task-state';
import { IBetResponse } from 'src/app/interfaces/Bet/ibet-response';
import { SocketResponseType } from 'src/app/enums/socket-response-type';
import { IMatchOpportunityResponse, IMatchOpportunity, IMatchPrice } from 'src/app/interfaces/Bet/imatch-response';
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
    opportunities: IMatchOpportunity[] = []
    sportsbook_ids: number[] = []
    selectedSportsbookIds: number[] = []; 
    sport_ids: number[] = []
    selectedSportIds: number[] = []; 
    selectedOpportunity: IMatchOpportunity

    kellyMultiplier: number = 1
    parentOdds: number = 0
    childOdds: number = 0
    budget: number = 100
    
    constructor( private websocketService: WebSocketService,
      private messageService: MessageService,
      private eventService: EventService ) {
      this.showEventDialog = false
      this.selectedOpportunity = {} as IMatchOpportunity
      this.triggerEventSubscription = this.websocketService.triggerEventObservable.subscribe({
        next: (response: IBetResponse) => {
          if (response.type == SocketResponseType.SCRAPING){ 
            this.taskState = response.data as TaskState;
            return
          }
          if (response.type == SocketResponseType.MATCHDATA) { 
            this.getLastSignal()
            let matchResponse = response.data as IMatchOpportunityResponse
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

    getOddClass(odd: IMatchPrice): { [key: string]: boolean } {
      return {
        'movement-up': odd.movement == Movement.UP as number,
        'movement-down': odd.movement == Movement.DOWN as number
      };
    }

    calculateStake(opportunity: IMatchOpportunity): number { 
      return this.kellyMultiplier*opportunity.stake*this.budget
    }

    calculateSelectedStake(): number { 
      if(this.parentOdds == 0) return 0
      const impl_prob = 1/this.parentOdds
      const kelly = impl_prob - (1 - impl_prob)/(this.childOdds-1)
      return this.kellyMultiplier*kelly*this.budget
    }

    setUsedEvent(opportunity: IMatchOpportunity) { 
      this.eventService.setUsedEvent(opportunity.match_id, opportunity.sportsbook_id).subscribe({
        next: (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Event set as used." })
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

    private updateOpportunities(response: IMatchOpportunityResponse) { 
      const opportunities = response.opportunities
      
      if (response.update_all) { 
        this.opportunities = opportunities
      }
      else { 
        const price_ids = new Set(response.price_ids)
        this.opportunities = this.opportunities.filter(opp => price_ids.has(opp.child.price_pk))
      }

      const oppIndexMap = new Map<number, number>();
      this.opportunities.forEach((opp, index) => {
        oppIndexMap.set(opp.child.price_pk, index);
      });
      
      opportunities.forEach(opp => {
        if (!this.sportsbook_ids.includes(opp.sportsbook_id)) {
          this.sportsbook_ids.push(opp.sportsbook_id)
        }
        if (!this.sport_ids.includes(opp.sport_id)) {
          this.sport_ids.push(opp.sport_id)
        }
        const existingIndex = oppIndexMap.get(opp.child.price_pk);
        if(existingIndex == undefined) {
          this.opportunities.push(opp)
          return
        }
        this.opportunities[existingIndex] = opp
      });
    }

    private padZero(num: number): string {
      return num < 10 ? '0' + num : num.toString();
    }
  }
  