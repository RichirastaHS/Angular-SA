import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree} from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService,) {}
  
  canActivate(): Observable<boolean> {
    return this.checkAccess();
  }

  canActivateChild(): Observable<boolean> {
    return this.checkAccess();
  }

  private checkAccess(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      tap(isLogged => {
        if (!isLogged) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
} 
