import { Component } from '@angular/core';
import { UdaService } from '../../service/uda.service';
import { RouterLink } from '@angular/router';

interface profileUser{
  name: string,
  username: string,
  email: string,
  created_ad: string,
}
@Component({
  selector: 'app-configuration',
  imports: [RouterLink],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})

export class ConfigurationComponent {
  profile!: profileUser;

  constructor(
    private udaService: UdaService
  ){}

  ngOnInit(): void{
    this.udaService.profile().subscribe({
      next: (response)=>{
        this.profile = response.user;
        console.log( this.profile);
      }
    })
  }
}
