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
    organization: new FormControl(''),
  });
  success:boolean=false;
  error:string;
  orgs:any;
  dataLoaded: Promise<boolean>;
  constructor(
  
	        private router : Router,
		private userService: UserService,
  ) { }

  ngOnInit() {
          this.userService.getAllOrgsPublic()
                .subscribe(
                    data => {
                        console.log(' success', data);
                        this.orgs = data.results;
                        this.dataLoaded = Promise.resolve(true);
                    },
                    err => {
                        console.log("Failed");
                        this.dataLoaded = Promise.resolve(false);
                    }
                );
	
  }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.userService.teamCreate(this.form.value)
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
