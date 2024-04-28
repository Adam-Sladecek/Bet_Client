import { Component } from '@angular/core';
import { IBet } from 'src/app/interfaces/ibet';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-hidden-bets',
  templateUrl: './hidden-bets.component.html',
  styleUrls: ['./hidden-bets.component.scss']
})
export class HiddenBetsComponent {
  hiddenBets: IBet[]

  constructor( private websocketService: WebSocketService ) {
    this.hiddenBets = websocketService.hiddenBets
  }

  renewBet(bet: IBet): void {
    this.websocketService.hiddenBets.forEach((element,index)=>{
      if(element.id == bet.id) this.websocketService.hiddenBets.splice(index,1);
    })
  }
}
