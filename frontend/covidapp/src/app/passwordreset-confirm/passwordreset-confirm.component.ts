
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "../services/auth.service";
import {Router} from "@angular/router"


@Component({
  selector: 'app-passwordreset-confirm',
  templateUrl: './passwordreset-confirm.component.html',
  styleUrls: ['./passwordreset-confirm.component.css']
})
export class PasswordresetConfirmComponent implements OnInit {
  password: string;
  password2 : string;
  token: string;
  success: boolean= false;
  fail : boolean = false;
  wait : boolean =true;
  error : boolean=false;
  errormessage: string = ''
  message: string = "Verifying the registration kindly wait for sometime";
  constructor(private authService:AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
       this.token = queryParams.get("token");
	});
       console.log(this.token);
  }

  onSubmit(){
      console.log("Submitted the form");
      this.authService.pwdResetConfirm({'token': this.token, 'password': this.password, 'password2':this.password2})
        .subscribe(
          data => {
                  console.log('login success', data);
                  this.success=true;
		  this.error=false;
                  setTimeout(() => {
                      this.router.navigate(['/login']);
                  }, 2000);
          },
          err => {
            console.error('login error', err);
	    console.error('error', err.error.detail);
	    var value = ''
            Object.keys(err.error).forEach(function(key){
             if (key == 'detail'){
		value = err.error[key]
	     }else {
             value = value  + key + ":" + err.error[key];
	     }
             console.log(value);
	    });
            this.error = true
	    this.errormessage = value
            this.success=false;
          }
      );

  }

}
