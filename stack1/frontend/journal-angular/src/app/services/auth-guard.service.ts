import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AccountService} from './account.service';


@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private accService: AccountService, private router: Router) { }

  canActivate(): boolean {
    if (!!this.accService.getApiKey()) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

}
