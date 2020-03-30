import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  email:string;
  errorMessage:string;
  error:boolean=false;
  success:boolean=false;
  message:string;
  constructor( private authService:AuthService) { }

  ngOnInit() {
  }

  onSubmit(){
      this.message = "Invitation in process please wait...";
      this.authService.invite({'email': this.email})
        .subscribe(
          data => {
                  console.log('Reset Successful', data);
		  this.message='';
                  this.success=true;
		  this.error=false;
          },
          err => {
            console.error('error', err);
	    this.errorMessage=this.authService.getErrorMessage(err);
            this.success=false;
	    this.error=true;
          }

      );


      console.log(this.email);
   }
}
