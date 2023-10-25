import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IBet } from 'src/app/interfaces/ibet';
import { ConfigService } from 'src/app/services/config.service';
import { LivebetService } from 'src/app/services/livebet.service';

@Component({
  selector: 'app-livebets',
  templateUrl: './livebets.component.html',
  styleUrls: ['./livebets.component.scss']
})
export class LivebetsComponent implements OnInit{
  bets: IBet[]
  selectedBets: IBet[]
  subscription? : Subscription;
  budget: number;
  oldLength: number;
  constructor( private betService: LivebetService, private configService: ConfigService ) {
    this.bets = []
    this.budget = 100
    this.selectedBets = []
    this.oldLength = 0
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
  getBets() {
    this.subscription = timer(0, 1000).pipe(
      switchMap(() => this.betService.getBets())
    ).subscribe(data => {
        this.bets = this.filterBets(data.data)
        // let numberOfActives = this.getNumberOfActives(this.bets);
        // if ( numberOfActives > this.oldLength) {
        //   this.playAudio();
        // }
        // this.oldLength = numberOfActives;
      });
  }
  filterBets(bets:IBet[]) {
    return bets.filter((bet) => !this.betService.hiddenBets.some((fbet) => {
      return fbet.betIdentifier == bet.betIdentifier
    }))
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
  isLoggedIn () {
    return this.configService.userLoggedIn
  }
  ngOnInit(): void {
    this.getBets()
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
}
}
