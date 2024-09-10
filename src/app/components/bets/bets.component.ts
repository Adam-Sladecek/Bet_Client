import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';

import { WebSocketService } from 'src/app/services/web-socket.service';
import { TaskState } from 'src/app/enums/task-state';
import { IBetResponse } from 'src/app/interfaces/Bet/ibet-response';
import { SocketResponseType } from 'src/app/enums/socket-response-type';
import { IMatchOpportunityResponse, IMatchOpportunity } from 'src/app/interfaces/Bet/imatch-response';
import { EventService } from 'src/app/services/event.service';
import { IOddModel } from 'src/app/interfaces/Bet/iodd-model';
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
    showOddDialog: boolean
    opportunities: IMatchOpportunity[] = []
    sportsbook_ids: number[] = []
    selectedOpportunity: IMatchOpportunity

    budgets: {[key: number]: number} = {}
    
    constructor( private websocketService: WebSocketService,
      private messageService: MessageService,
      private eventService: EventService ) {
      this.showEventDialog = false
      this.showOddDialog = false
      this.selectedOpportunity = {} as IMatchOpportunity
      this.triggerEventSubscription = this.websocketService.triggerEventObservable.subscribe({
        next: (response: IBetResponse) => {
          if (response.type == SocketResponseType.STATERESPONSE){ 
            this.taskState = response.data as TaskState;
            return
          }
          if (response.type == SocketResponseType.MATCHDATA) { 
            this.getLastSignal()
            let matchResponse = response.data as IMatchOpportunityResponse
            this.updateOpportunities(matchResponse)
            matchResponse.sportsbook_ids.forEach(id => { 
              if (this.budgets[id] == undefined) { 
                this.budgets[id] = 100
              }
            })
            this.sportsbook_ids = matchResponse.sportsbook_ids
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
      this.taskState = TaskState.ENDING;
      this.websocketService.sendMessage({ action: SOCKET_CONSTANTS.END });
    }

    open_configuration() { 
      this.showEventDialog = true
    }

    open_opportunity_dialog (opportunity: IMatchOpportunity) { 
      this.selectedOpportunity = opportunity
      this.showOddDialog = true
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

    getOddModelFromSb(sportsbook_id: number, odds: IOddModel[]): IOddModel | undefined {
      if (odds.length == 0) return undefined
      var sbOdd = odds.find(odd => odd.sportsbook_id == sportsbook_id)
      if (sbOdd == null) return undefined
      return sbOdd
    }
    
    getOddClass(sportsbook_id: number, odds: IOddModel[]): { [key: string]: boolean } {
      const sbOdd = this.getOddModelFromSb(sportsbook_id, odds)
      if (!sbOdd) return {}
      return {
        'movement-up': sbOdd.movement == Movement.UP as number,
        'movement-down': sbOdd.movement == Movement.DOWN as number
      };
    }

    calculateStake(sbId: number, oddModel?: IOddModel): number { 
      if(!oddModel) return 0
      // Kelly
      const percentage = oddModel.kelly? oddModel.kelly: 0
      return percentage*this.budgets[sbId]
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
        const oppIds = new Set(opportunities.map(opp => opp.odd_id))
        this.opportunities = this.opportunities.filter(opp => oppIds.has(opp.odd_id))
      }
      else { 
        const match_ids = new Set(response.match_ids)
        this.opportunities = this.opportunities.filter(opp => match_ids.has(opp.match_id))
      }

      const oppIndexMap = new Map<number, number>();
      this.opportunities.forEach((opp, index) => {
        oppIndexMap.set(opp.odd_id, index);
      });
      
      opportunities.forEach(opp => {
        const existingIndex = oppIndexMap.get(opp.odd_id);
        if(existingIndex == undefined) {
          this.opportunities.push(opp)
          return
        }
        this.opportunities[existingIndex] = opp
      });

      response.match_ids.forEach(match_id => {
        const count = this.opportunities.filter(opp => opp.match_id == match_id).length
        if (count > 1) { 
          this.opportunities = this.opportunities.filter(opp => opp.match_id != match_id || opp.odd_id != match_id )
        }
      });
    }

    private padZero(num: number): string {
      return num < 10 ? '0' + num : num.toString();
    }
  }
  