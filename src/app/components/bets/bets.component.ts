import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IBet } from 'src/app/interfaces/ibet';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { TaskState } from 'src/app/enums/task-state';
import { IError } from 'src/app/interfaces/ierror';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss'],
  providers: [MessageService]
})
export class BetsComponent implements OnInit{
    private oldLength: number
    private defaultBet: IBet
    private triggerEventSubscription: Subscription
    private taskState!: TaskState
    bets: IBet[]
    betInDetail!: IBet
    budget: number
    lastSignal?: string
    lowerBound:number
    error!: IError
    
    constructor( private websocketService: WebSocketService,
      private messageService: MessageService ) {
      this.bets = []
      this.budget = 100
      this.oldLength = 0
      this.lowerBound = 1.3
      this.defaultBet = {id: -1} as IBet
      this.triggerEventSubscription = this.websocketService.triggerEventObservable.subscribe(() => {
        this.update()
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
    
    betDetail(bet: IBet): void {
      if (this.betInDetail && this.betInDetail.id == bet.id) {
        this.betInDetail = this.defaultBet ;
        return
      }
      this.betInDetail = structuredClone(bet)
    }
    
    editBet(bet: IBet): boolean { 
      return this.betInDetail && this.betInDetail.id == bet.id;
    }
    
    getEditedBetProfit(): number {
      var courses = this.betInDetail.details.map(detail=> detail.odd)
      var cmm = this.getImplProb(courses)
      return 100/cmm - 1;
    }
    
    getEditedBetAmount(index: number): number {
      var courses = this.betInDetail.details.map(detail=> detail.odd)
      var cmm = this.getImplProb(courses)
      var bip = this.getImplProb([this.betInDetail.details.at(index)?.odd])
      return bip/cmm;
    }
    
    getImplProb(probs: (number | undefined)[]): number {
      var sum = 0
      probs.forEach((prob) => {
        sum = sum + 100/(prob as number)
      })
      return sum
    }
    
    hideBet(bet: IBet): void {
      this.websocketService.hiddenBets.push(bet)
      this.bets = this.bets.filter((bet) => !this.websocketService.hiddenBets.some((fbet) => {
        return fbet.id == bet.id
      }))
    }
    
    getImageRoute(sbName?: string): string {
      switch (sbName) {
        case "Betfair":
          return "assets/layout/images/sportsbooks/betfair.png"
        case "IFortuna":
          return "assets/layout/images/sportsbooks/fortuna.jpg"
        case "Nike":
          return "assets/layout/images/sportsbooks/nike.png"
        case "Tipsport":
          return "assets/layout/images/sportsbooks/tipsport.png"
        case "Tipos":
          return "assets/layout/images/sportsbooks/tipos.png"
        case "Doxxbet":
          return "assets/layout/images/sportsbooks/doxxbet.png"
        default:
          return ""
      }
    }
    
    startScrape(): void {
      this.websocketService.sendMessage({ action: 'start' });
    }
    
    endScrape(): void {
      this.taskState = TaskState.ENDING;
      this.websocketService.sendMessage({ action: 'end' });
    }

    filterBets(bets:IBet[]): IBet[] {
      return bets.filter((bet) => !this.websocketService.hiddenBets.some((fbet) => {
        return fbet == bet
      }))
    }

    filterBetsByLowerBound(bets:IBet[]): IBet[] {
      return bets.filter((bet) => bet.profit*100 >= this.lowerBound)
    }

    import() { 
      this.websocketService.sendMessage({ action: 'import' });
    }

    private update(): void { 
      this.taskState = this.websocketService.state;
      this.error = this.websocketService.error;
      if (this.error.active) { 
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error.message})
      }
      this.bets = this.filterBets(this.websocketService.bets);
      if (this.filterBetsByLowerBound(this.bets).length > this.oldLength) this.playAudio();
      this.oldLength = this.filterBetsByLowerBound(this.bets).length
      const currentDate = new Date();
      const currentHours = this.padZero(currentDate.getHours());
      const currentMinutes = this.padZero(currentDate.getMinutes());
      const currentSeconds = this.padZero(currentDate.getSeconds());
      this.lastSignal = currentHours + ':' + currentMinutes + ':' + currentSeconds;
    }

    private padZero(num: number): string {
      return num < 10 ? '0' + num : num.toString();
    }
    
    private playAudio(): void {
      let audio = new Audio();
      audio.src = "../../assets/music/ding-idea-40142.mp3";
      audio.load();
      audio.play();
    }
    
  }
  