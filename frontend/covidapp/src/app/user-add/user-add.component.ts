import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import {Router} from "@angular/router"

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  username:string;
  email:string;
  password:string;
  password2:string;
  is_staff:boolean=false;
  is_superuser:boolean=false
  success:boolean=false;
  errorMessage:string="";
  constructor(private authService:AuthService, private userService:UserService, private router: Router) {
  }
  ngOnInit() {
  }

  onRegister(){
      console.log(this.username);
      console.log(this.authService.isAdmin());
      this.userService.userCreate({'name': this.username,'email': this.email, 'password': this.password, 'password2': this.password2 ,'is_staff':this.is_staff})
      .subscribe(
        data => {
                console.log('register success', data);
                this.success=true;
                setTimeout(() => {
                  this.router.navigate(['/users/']);
                }, 1000);
        },
         err => {
                console.log(err.error);
                this.success=false;
                this.errorMessage=this.authService.getErrorMessage(err);
             }
      );
  }
}


