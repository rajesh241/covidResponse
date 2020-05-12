import { Component, OnInit, isDevMode } from '@angular/core';
import { AuthService } from './services/auth.service';
import { EntityService } from './services/entity.service';
import { VERSION } from '../environments/version';
import { environment } from '../environments/environment';

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
    private subscriber;
    private prevSubscriber;
    public isDev: boolean = false;
    public user;
    public group;

    constructor(
	public entityService: EntityService,
	public authService: AuthService
    ) {
	console.log(`AppComponent.constructor(${JSON.stringify(VERSION)})`);
	console.log(`AppComponent.constructor(API_URL=[${environment.apiURL}]) => VERSION`, VERSION);
        if (isDevMode())
            this.isDev = true;
	if (isDevMode() && environment.apiURL.includes('coastindia')) {
	    window.alert('Using Production Backend in Dev Mode!');
	}
        this.authService.session.subscribe(session => {
            if (session) { // FIXME this should be updated from session ---vvv
	        console.log(`AppComponent.constructor() => session.subscribe(${JSON.stringify(session)})`);
                this.user =  localStorage.getItem('username');
                this.group = localStorage.getItem('group');
            }
        });
    }

    ngOnInit() {
	console.log(`AppComponent.ngOnInit(${this.version}-${this.hash} Build[${this.build}])`);
	// Set the version checker at periodic intervals
	if(false && !isDevMode())
	    this.setUpVersionChecker();
	this.versionCheck();
    }

    setUpVersionChecker() {
	const frequency = 1000 * 60 * 30; // 30 mins
	setInterval(() => {
	    this.versionCheck();
	}, frequency);
	this.versionCheck();
    }

    versionCheck() {
	this.subscriber = this.entityService.getVersion()
	    .subscribe(version => {
		console.log(`AppComponent.versionCheck().subscription(SERVER Version: ${JSON.stringify(version)})`);

		this.commit_url = version.commit_url;
		this.version_str = `${this.version}-${version.hash}`

		if (version.hash != this.hash) {
		    console.log(`AppComponent.versionCheck(${this.version}-${this.hash} Build[${this.build}]) does not match ${this.version_str}`);
		    // window.alert(`New Version Available [${this.version_str}]. Will reload page`);
		    // window.location.reload(true);
		}
	    });

	if (this.prevSubscriber) {
	    this.prevSubscriber.unsubscribe();
	}
	this.prevSubscriber = this.subscriber;
    }

    reload() {
	window.alert('Will reload page!');
	window.location.reload(true);
    }
}
