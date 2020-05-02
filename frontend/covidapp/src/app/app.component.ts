import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { EntityService } from './services/entity.service';
import { VERSION } from '../environments/version';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'CoAST India';
    public version: string = VERSION.version;
    public hash: string = VERSION.hash;
    public build: string = VERSION.build;
    public github_url: string = `https://github.com/rajesh241/covidResponse/`;
    public commit_url: string;
    public version_str: string;

    constructor(
	public entityService: EntityService,
	public authService: AuthService
    ) {
	console.log(`AppComponent.constructor(${JSON.stringify(VERSION)})`);
	console.log(VERSION);
    }

    ngOnInit() {
	console.log(`AppComponent.ngOnInit(${this.version}-${this.hash} Build[${this.build}])`);
	const frequency = 1000 * 60 * 30;
	this.entityService.getVersion()
	    .subscribe(version => {
		this.commit_url = version.commit_url;
		this.version_str = `${this.version}-${this.hash}`
		console.log(`AppComponent.ngOnInit(SERVER Version: ${this.version_str})`);

		/*
		setInterval(() => {
		    this.versionCheck(version);
		}, frequency);
		*/
		this.versionCheck(version);
	    });

    }

    versionCheck(version) {
	console.log(`AppComponent.versionCheck(Version: ${this.version_str})`);
	if (version.hash != this.hash) {
	    console.log(`AppComponent.versionCheck(${this.version}-${this.hash} Build[${this.build}]) does not match ${this.version_str}`);
	    // window.alert(`New Version Available [${this.version_str}]. Will reload page`);
	    // window.location.reload(true);
	}
    }
}
