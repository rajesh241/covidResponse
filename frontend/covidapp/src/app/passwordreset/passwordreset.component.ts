import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent implements OnInit {
  email:string;
  errormessage:string;
  error:boolean=false;
  success:boolean=false;
  constructor( private authService:AuthService) { }

  ngOnInit() {
  }

  onSubmit(){
      this.authService.passwordreset({'email': this.email})
        .subscribe(
          data => {
                  console.log('Reset Successful', data);
                  this.success=true;
		  this.error=false;
          },
          err => {
            console.error('error', err);
	    this.errormessage=this.authService.getErrorMessage(err);
            this.success=false;
	    this.error=true;
          }

      );


      console.log(this.email);
   }
}
