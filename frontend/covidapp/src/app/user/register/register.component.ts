import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router"
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    username:string;
    email:string;
    password:string;
    password2:string;
    success:boolean=false;
    regError:string="";
    message:string;
    token: any;
    constructor(/*private FIXME */public authService:AuthService, private router: Router) {
    }
    ngOnInit() {
    }

    onRegister(){
        console.log(this.username);
        this.message = "Registration in process please wait...";
        this.authService.register({'name': this.username,'email': this.email, 'password': this.password, 'password2': this.password2})
            .subscribe(
                data => {
                    console.log('register success', data);
                    this.message='';
                    this.success=true;
                },
                err => {
                    console.error('registration error', err);
                    console.error('error', err.error.detail);
                    var value = ''
                    Object.keys(err.error).forEach(function(key){
                        if (key == 'detail'){
                            value = err.error[key]
                        }else {
                            value = value  +  "<p>" + err.error[key]+"</p>" ;
                        }
                        console.log(value);
                    });
                    this.message='';
                    this.regError = value
                    this.success=false;

                }
            );
    }
}
