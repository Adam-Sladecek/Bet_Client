import { Component, OnInit } from '@angular/core';
import { BetService } from 'src/app/services/bet.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IBet } from 'src/app/interfaces/ibet';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss']
})
export class BetsComponent implements OnInit{
    bets: IBet[]
    selectedBets: IBet[]
    subscription? : Subscription;
    checkServerState? : Subscription;
    budget: number;
    oldLength: number;
    appRunning: boolean
    endingScrape: boolean
    disableButtons: boolean
    error: boolean
    lastSignal?: Date
    lowerBound:number;
    hideInactives:boolean
    // urlSegment: string
    constructor( private betService: BetService , private configService: ConfigService) {
      this.bets = []
      this.budget = 100
      this.selectedBets = []
      this.oldLength = 0
      this.appRunning = false
      this.endingScrape = false
      this.disableButtons = true
      this.error = false
      this.lowerBound = 1.3
      this.hideInactives = false
      // this.urlSegment = ''
    }
    playAudio(){
      let audio = new Audio();
      audio.src = "../../assets/music/ding-idea-40142.mp3";
      audio.load();
      audio.play();
    }
    getNumberOfActives(bets: IBet[]): number {
      return bets.filter(bet => bet.active).length
    }
    filterActives(bets: IBet[]):IBet[] {
      return bets.filter(bet => bet.active)
    }
    getBets() {
      this.subscription = timer(0, 1000).pipe(
        switchMap(() => this.betService.getBets())
      ).subscribe({
        next: (data) => {
          if (data.data.length > 0) {
            this.lastSignal = data.data.at(0)?.created
          }
          if (this.hideInactives) {
            this.bets = this.filterActives(data.data)
            this.bets = this.filterBets(this.bets)
          }
          else {
            this.bets = this.filterBets(data.data)
          }
          let numberOfActives = this.getNumberOfActives(this.bets);
          if ( numberOfActives > this.oldLength) {
            this.playAudio();
          }
          this.oldLength = numberOfActives;
        },
        error: (error) => {
          this.error = true;
          console.error('Error:', error);
        },
        complete: () => {
          console.log('Observable completed');
        }
      })
    }
    checkState() {
      this.checkServerState = timer(0, 5000).pipe(
        switchMap(() => this.betService.checkState())
      ).subscribe({
        next: (data) => {
          this.disableButtons = false
          if(data.running){
            this.endingScrape = data.endingScrape
            this.appRunning = true
          }
          else{
            this.appRunning = false
          }
        },
        error: (error) => {
          this.error = true;
          console.error('Error:', error);
        },
        complete: () => {
          console.log('Observable completed');
        }
      });
    }
    filterBets(bets:IBet[]):IBet[] {
      return bets.filter((bet) => !this.betService.hiddenBets.some((fbet) => {
        return fbet.betIdentifier == bet.betIdentifier
      }) && bet.yield >= this.lowerBound)
    }
    hasBets(nums: (number | undefined)[]){
      return nums.every(num => num != undefined && num != null)
    }
    betDetail(bet: IBet) {
      this.selectedBets = [bet]
    }
    recalculateYield(courses: (number | undefined)[]) {
      var cmm = this.getImplProb(courses)
      return this.budget*(100/cmm - 1)
    }
    recalculateBet(num: (number | undefined), courses: (number | undefined)[]) {
      var cmm = this.getImplProb(courses)
      var bip = this.getImplProb([num])
      return this.budget*bip/cmm
    }
    getImplProb(probs: (number | undefined)[]) {
      var sum = 0
      probs.forEach((prob) => {
        sum = sum + 100/(prob as number)
      })
      return sum
    }
    hideBet(bet: IBet) {
      this.betService.hiddenBets.push(bet)
      this.bets = this.bets.filter((bet) => !this.betService.hiddenBets.some((fbet) => {
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
    // setUrlSegment() {
    //   this.betService.setBaseUrl(this.urlSegment);
    // }
    startScrape(){
      this.disableButtons = true
      this.betService.startScrape().subscribe(result => {
        this.appRunning = true
        this.disableButtons = false
      });
    }
    endScrape(){
      this.endingScrape = true
      this.disableButtons = true
      this.betService.endScrape().subscribe(result => {
        this.endingScrape = false
        this.appRunning = false
        this.disableButtons = false
      });
    }
    isLoggedIn () {
      return this.configService.userLoggedIn
    }
    ngOnInit(): void {
      this.checkState()
      this.getBets()
    }
    ngOnDestroy() {
      this.subscription?.unsubscribe();
      this.checkServerState?.unsubscribe();
    }
}
