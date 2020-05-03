import { Component, OnInit, isDevMode } from '@angular/core';
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
    private subscriber;
    private prevSubscriber;

    constructor(
	public entityService: EntityService,
	public authService: AuthService
    ) {
	console.log(`AppComponent.constructor(${JSON.stringify(VERSION)})`);
	console.log(VERSION);
    }

    ngOnInit() {
	console.log(`AppComponent.ngOnInit(${this.version}-${this.hash} Build[${this.build}])`);
	// Set the version checker at periodic intervals
	if(false && !isDevMode())
	    this.setUpVersionChecker();
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
		    window.alert(`New Version Available [${this.version_str}]. Will reload page`);
		    window.location.reload(true);
		}
	    });

	if (this.prevSubscriber) {
	    this.prevSubscriber.unsubscribe();
	}
	this.prevSubscriber = this.subscriber;
    }
}
