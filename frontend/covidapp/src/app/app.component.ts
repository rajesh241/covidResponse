import { Component, OnInit } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { VERSION } from '../environments/version';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'CoAST India';
    version: string;
    hash: string;
    build: string;
    github_url: string;

    constructor(public authService:AuthService) {
	console.log('AppComponent.console()');
	console.log(VERSION);
	this.version = VERSION.version;
	this.hash = VERSION.hash;
	this.build = VERSION.build;
	this.github_url = `https://github.com/rajesh241/covidResponse/`;
    }
}
