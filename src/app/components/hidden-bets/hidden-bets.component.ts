import { Component } from '@angular/core';
import { IBet } from 'src/app/interfaces/ibet';
import { BetService } from 'src/app/services/bet.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-hidden-bets',
  templateUrl: './hidden-bets.component.html',
  styleUrls: ['./hidden-bets.component.scss']
})
export class HiddenBetsComponent {
  hiddenBets: IBet[]
  constructor( private betService: BetService, private configService: ConfigService ) {
    this.hiddenBets = betService.hiddenBets
  }
  renewBet(bet: IBet) {
    this.betService.hiddenBets.forEach((element,index)=>{
      if(element == bet) this.betService.hiddenBets.splice(index,1);
   })
  }
  isLoggedIn () {
    return this.configService.userLoggedIn
  }
}
