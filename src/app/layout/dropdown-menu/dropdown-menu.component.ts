import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UdaService } from '../../service/uda.service';
import { TimeService } from '../../service/time.service';

export interface user{
  name:string
  role:string
}
export interface UserActivityNotification {
  id: string;
  type: string;
  notifiable_id: number;
  notifiable_type: string;
  data: {
    title: string;
    message: string;
    description: string;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
}
@Component({
  selector: 'app-dropdown-menu',
  imports: [MatButtonModule, MatMenuModule, RouterLink],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.css'
})

export class DropdownMenuComponent {
  profile: string = '';
  name: string = '';
  role: string = '';
  constructor( 
    private authsService: AuthService, 
    private router: Router,
    private time: TimeService,
    private udaService: UdaService
  ) {}
  unreadNot: UserActivityNotification[]=[];
  ngOnInit(): void {
    this.authsService.getUserData().subscribe((user) => {
      if (user) {
        this.name = user.name;
        this.role = user.role;
      }
    });
    this.udaService.profile().subscribe({
      next: (response)=>{
        this.profile = response.profile_photo;
      }
    })

    this.udaService.notification().subscribe({
      next: (response) =>{
        const notificiones = response.unread_notifications
        this.unreadNot = (response.unread_notifications as UserActivityNotification[]).map((act: UserActivityNotification)=>({
          ...act,
           created_at: this.time.getRelativeTime(act.created_at),
          updated_at: this.time.getRelativeTime(act.updated_at)
        }));
      },
      error: (error) =>{

      }
    });
  }

  isDropdownOpen = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authsService.logoutUser().subscribe({
      next: () => {
        this.router.navigate(['/login']); // Redirige al login
      },
      error: (error) => {
      }
    });
  }
}
