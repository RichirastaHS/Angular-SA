import { Component } from '@angular/core';
import { UdaService } from '../../service/uda.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

interface profileUser {
  id: number;
  name: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
  email_verified_at: string;
}
@Component({
  selector: 'app-user-data',
  imports: [RouterLink],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css'
})
export class UserDataComponent {
 profile!: profileUser;

  constructor(
    private udaService: UdaService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  ngOnInit(): void{
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      console.log(id);
      this.udaService.infoUser(+id).subscribe({
        next: (response)=>{
          this.profile = response;
          console.log(response);
          console.log(this.profile);
        },
        error:(error)=>{
          this.router.navigate(['/main/mas_detalles']);
        }
      });
    }else{
      this.router.navigate(['/main/mas_detalles']);
    }
}
}
