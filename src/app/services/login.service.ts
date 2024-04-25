import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _userLoggedIn !: boolean

  constructor() {
    this.userLoggedIn = localStorage.getItem('loggedIn') == 'true' || false
  }

  get userLoggedIn(): boolean {
    return this._userLoggedIn
  } 

  private set userLoggedIn(_value: boolean) {
    this._userLoggedIn = _value
  } 
}
