import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree} from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService,) {}
  
  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn().pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          return true;
        } else {
          return this.router.parseUrl('/login');
        }
      })
    );
  }
} 
