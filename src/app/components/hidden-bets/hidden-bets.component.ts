import { Component } from '@angular/core';
import { IBet } from 'src/app/interfaces/ibet';
import { ConfigService } from 'src/app/services/config.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-hidden-bets',
  templateUrl: './hidden-bets.component.html',
  styleUrls: ['./hidden-bets.component.scss']
})
export class HiddenBetsComponent {
  hiddenBets: IBet[]
  constructor( private websocketService: WebSocketService, private configService: ConfigService ) {
    this.hiddenBets = websocketService.hiddenBets
  }
  renewBet(bet: IBet) {
    this.websocketService.hiddenBets.forEach((element,index)=>{
      if(element == bet) this.websocketService.hiddenBets.splice(index,1);
   })
  }
  isLoggedIn () {
    return this.configService.userLoggedIn
  }
}
