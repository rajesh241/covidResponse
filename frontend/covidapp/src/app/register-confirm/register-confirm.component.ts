import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "../services/auth.service";
import {Router} from "@angular/router"


@Component({
  selector: 'app-register-confirm',
  templateUrl: './register-confirm.component.html',
  styleUrls: ['./register-confirm.component.css']
})
export class RegisterConfirmComponent implements OnInit {
  uidb64: string;
  token: string;
  success: boolean= false;
  fail : boolean = false;
  wait : boolean =true;
  error: string = ''
  message: string = "Verifying the registration kindly wait for sometime";
  constructor(private authService:AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
       this.token = queryParams.get("token");
       this.uidb64 = queryParams.get("uidb64");
	});
       console.log(this.token);
       console.log(this.uidb64);
       this.authService.verifyregistration({'uidb64': this.uidb64, 'token': this.token})
        .subscribe(
          data => {
                  console.log('Verification Successful', data);
                  this.wait = false;
                  this.success=true;
                  setTimeout(() => {
                     this.router.navigate(['/login']);
                  }, 1000);
          },
          err => {
            console.error('login error', err);
            var s:string=""
            Object.keys(err.error).forEach(function(key){
             var value = err.error[key];
             console.log(value[0]);
             s=value[0];
          });
          
            this.wait = false;
            this.fail=true;
            this.error=s;//JSON.stringify(err.error);
          }
    )
  }

}
