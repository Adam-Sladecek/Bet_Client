import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IBet } from 'src/app/interfaces/ibet';
import { ConfigService } from 'src/app/services/config.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { TaskState } from 'src/app/interfaces/task-state';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss']
})
export class BetsComponent implements OnInit{
    bets: IBet[]
    betInDetail!: IBet
    budget: number;
    oldLength: number;
    lastSignal?: string
    lowerBound:number;
    defaultBet: IBet = {id: -1} as IBet
    private triggerEventSubscription: Subscription;
    taskState!: TaskState
    error!: boolean; 
    
    constructor( private configService: ConfigService, private websocketService: WebSocketService) {
      this.bets = []
      this.budget = 100
      this.oldLength = 0
      this.lowerBound = 1.3
      this.triggerEventSubscription = this.websocketService.triggerEventObservable.subscribe(() => {
        this.update()
      });
    }

    update() { 
      this.taskState = this.websocketService.state;
      this.error = this.websocketService.error;
      this.bets = this.websocketService.bets;
      if (this.bets.length > this.oldLength) this.playAudio();
      this.oldLength = this.bets.length
      const currentDate = new Date();
      const currentHours = this.padZero(currentDate.getHours());
      const currentMinutes = this.padZero(currentDate.getMinutes());
      const currentSeconds = this.padZero(currentDate.getSeconds());
      this.lastSignal = currentHours + ':' + currentMinutes + ':' + currentSeconds;
    }

    padZero(num: number): string {
      return num < 10 ? '0' + num : num.toString();
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

    playAudio(){
      let audio = new Audio();
      audio.src = "../../assets/music/ding-idea-40142.mp3";
      audio.load();
      audio.play();
    }

    filterBets(bets:IBet[]):IBet[] {
      return bets.filter((bet) => bet.profit*this.budget >= this.lowerBound && !this.websocketService.hiddenBets.some((fbet) => {
        return fbet == bet
      }))
    }

    betDetail(bet: IBet) {
      if (this.betInDetail && this.betInDetail.id == bet.id) {
        this.betInDetail = this.defaultBet;
        return
      }
      this.betInDetail = structuredClone(bet)
    }

    editBet(bet: IBet) { 
      return this.betInDetail && this.betInDetail.id == bet.id;
    }

    getEditedBetProfit() {
      var courses = this.betInDetail.details.map(detail=> detail.odd)
      var cmm = this.getImplProb(courses)
      return 100/cmm - 1;
    }

    getEditedBetAmmount(index: number) {
      var courses = this.betInDetail.details.map(detail=> detail.odd)
      var cmm = this.getImplProb(courses)
      var bip = this.getImplProb([this.betInDetail.details.at(index)?.odd])
      return bip/cmm;
    }

    getImplProb(probs: (number | undefined)[]) {
      var sum = 0
      probs.forEach((prob) => {
        sum = sum + 100/(prob as number)
      })
      return sum
    }

    hideBet(bet: IBet) {
      this.websocketService.hiddenBets.push(bet)
      this.bets = this.bets.filter((bet) => !this.websocketService.hiddenBets.some((fbet) => {
        return fbet == bet
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

    startScrape(){
      this.websocketService.sendMessage({ action: 'start' });
    }

    endScrape(){
      this.taskState = TaskState.ENDING;
      this.websocketService.sendMessage({ action: 'end' });
    }

    isLoggedIn () {
      return this.configService.userLoggedIn
    }

    ngOnInit(): void {
      this.websocketService.connect();
    }

    ngOnDestroy() {
      this.triggerEventSubscription.unsubscribe();
    }
}
