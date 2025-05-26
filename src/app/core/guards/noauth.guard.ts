import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService,) {}
    
    canActivate(): Observable<boolean> {
      return this.checkAccess();
    }
  
    canActivateChild(): Observable<boolean> {
      return this.checkAccess();
    }
  checkAccess(): Observable<boolean> {
  return this.authService.isLoggedIn().pipe(
    tap(isLogged => {
      if (isLogged) {
        this.router.navigate(['/main']);
      }
    }),
    map(isLogged => !isLogged) // si está logueado, no permitir acceso
  );
}

    
}
