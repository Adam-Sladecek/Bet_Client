import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { TaskState } from 'src/app/enums/task-state';
import { MessageService } from 'primeng/api';
import { IBetResponse } from 'src/app/interfaces/Bet/ibet-response';
import { SocketResponseType } from 'src/app/enums/socket-response-type';
import { IMatch, IMatchResponse } from 'src/app/interfaces/Bet/imatch-response';
import { EventService } from 'src/app/services/event.service';
import { IOddModel } from 'src/app/interfaces/Bet/iodd-model';
import { Movement } from 'src/app/enums/movement';

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
    matches: IMatch[] = []
    sportsbook_ids: number[] = []
    selectedMatch: IMatch
    
    constructor( private websocketService: WebSocketService,
      private messageService: MessageService,
      private eventService: EventService ) {
      this.showEventDialog = false
      this.showOddDialog = false
      this.selectedMatch = {name: ""} as IMatch
      this.triggerEventSubscription = this.websocketService.triggerEventObservable.subscribe({
        next: (response: IBetResponse) => {
          if (response.type == SocketResponseType.STATERESPONSE){ 
            this.taskState = response.data as TaskState;
            return
          }
          if (response.type == SocketResponseType.MATCHDATA) { 
            this.getLastSignal()
            let matchResponse = response.data as IMatchResponse
            this.updateMatches(matchResponse.matches)
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
      this.websocketService.sendMessage({ action: 'start' });
    }
    
    endScrape(): void {
      this.taskState = TaskState.ENDING;
      this.websocketService.sendMessage({ action: 'end' });
    }

    open_configuration() { 
      this.showEventDialog = true
    }

    open_opportunity_dialog (match: IMatch) { 
      this.selectedMatch = match
      this.showOddDialog = true
    }

    getSbImageRoute(sbId: number): string {
      return this.eventService.getSbImageRoute(sbId);
    }
  
    getSportImageRoute(sportId: number): string {
      return this.eventService.getSportImageRoute(sportId);
    }

    getMatchFromSb(sportsbook_id: number, odds: IOddModel[]): IOddModel | undefined {
      if (odds.length == 0) return undefined
      var sbOdd = odds.find(odd => odd.sportsbook_id == sportsbook_id)
      if (sbOdd == null) return undefined
      return sbOdd
    }
    
    getOddClass(sportsbook_id: number, odds: IOddModel[]): { [key: string]: boolean } {
      if (odds.length == 0) return {}
      var sbOdd = odds.find(odd => odd.sportsbook_id == sportsbook_id)
      if (sbOdd == null) return {}
      return {
        'movement-up': sbOdd.movement == Movement.UP as number,
        'movement-down': sbOdd.movement == Movement.DOWN as number
      };
    }

    private getLastSignal() {
      const currentDate = new Date();
      const currentHours = this.padZero(currentDate.getHours());
      const currentMinutes = this.padZero(currentDate.getMinutes());
      const currentSeconds = this.padZero(currentDate.getSeconds());
      this.lastSignal = currentHours + ':' + currentMinutes + ':' + currentSeconds;
    }

    private updateMatches(matches: IMatch[]) { 
      const matchIds = new Set(matches.map(match => match.match_id));
    
      this.matches = this.matches.filter(match => matchIds.has(match.match_id));
      
      const matchIndexMap = new Map<number, number>();
      this.matches.forEach((match, index) => {
          matchIndexMap.set(match.match_id, index);
      });
      
      matches.forEach(match => {
        const existingIndex = matchIndexMap.get(match.match_id);
        if(existingIndex == undefined) {
          this.matches.push(match)
          return
        }
        const existingMatch = this.matches[existingIndex];
        existingMatch.time = match.time;
        let opportunities = match.opportunities.filter(opp => opp.odds.length > 0)
        if (!opportunities.length) return
        opportunities.forEach(opp => { 
          const oppIndex = existingMatch.opportunities.findIndex(p => p.name == opp.name)
          if (oppIndex < 0) { 
            existingMatch.opportunities.push(opp)
            return
          }
          existingMatch.opportunities[oppIndex] = opp
        })
      });
    }

    private padZero(num: number): string {
      return num < 10 ? '0' + num : num.toString();
    }
  }
  