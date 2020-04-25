import { Input, Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { OnInit, NgZone } from '@angular/core';
import { AuthService as GAuthService } from 'angular4-social-login'; 
import { Router } from "@angular/router"

import { UserService } from "../../services/user.service";


@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.css']
})
export class GroupAddComponent implements OnInit {

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
  });
  success:boolean=false;
  error:string;
  constructor(
  
	        private router : Router,
		private userService: UserService,
  ) { }

  ngOnInit() {
  }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.userService.groupCreate(this.form.value)
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
                        this.error="Unable to create group"
                     }
              );

    }
  }
}
