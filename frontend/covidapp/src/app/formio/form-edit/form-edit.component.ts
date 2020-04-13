import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { formioConfig } from '../../formio/config';

@Component({
    selector: 'app-form-edit',
    templateUrl: './form-edit.component.html',
    styleUrls: ['./form-edit.component.css']
})
export class FormEditComponent implements OnInit {
    title:string = 'Update the prefilled form';
    data = {'initial_data': 'This needs to update with latest data', 'title': 'Howdie Word!'};
    json_url = window.origin + '/assets/forms/form.json';
    json_input: any;
    json_pre: any;
    form_url = formioConfig.appUrl + '/data/helpseeker';
    latitude: number;
    longitude: number;
    zoom:number;
    address: string = '';
    private geoCoder;

    @ViewChild('search', { static: false })
    public searchElementRef: ElementRef;

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone
    ) {
        this.data.title = this.title;
        this.json_input = {"_id":"5e8d134f7c06a565e7abcf25","type":"resource","tags":["common"],"owner":"5e8a3d7bf1f3d54924170187","components":[{"autofocus":false,"input":true,"tableView":true,"inputType":"text","inputMask":"","label":"Group id","key":"groupId","placeholder":"","prefix":"","suffix":"","multiple":false,"defaultValue":"","protected":false,"unique":true,"persistent":true,"hidden":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":false,"minLength":"","maxLength":"","pattern":"","custom":"","customPrivate":false},"conditional":{"show":"","when":null,"eq":""},"type":"textfield","labelPosition":"top","inputFormat":"plain","tags":[],"properties":{},"lockKey":true},{"key":"contactheader","label":"Contact header","input":false,"tag":"b","attrs":[{"value":"","attr":""}],"className":"","content":"Please provide us details about one or more contact persons","type":"htmlelement","hideLabel":true,"tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{}},{"autofocus":false,"input":true,"tree":true,"components":[{"clearOnHide":true,"input":true,"tableView":true,"key":"contactContactperson","src":"","reference":true,"form":"5e8d13b27c06a565e7abcf27","path":"","label":"Contact person","protected":false,"unique":false,"persistent":true,"type":"form","project":"","inDataGrid":true,"labelPosition":"top","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{}}],"tableView":true,"label":"Contact","key":"contact","protected":false,"persistent":true,"hidden":false,"clearOnHide":true,"type":"datagrid","addAnotherPosition":"bottom","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{},"striped":true},{"autofocus":false,"input":true,"tree":true,"components":[{"clearOnHide":true,"input":true,"tableView":true,"key":"locationCurrentlocation","src":"","reference":true,"form":"5e8d1bbe7c06a565e7abcf29","path":"","label":"Current location","protected":false,"unique":false,"persistent":true,"type":"form","project":"","inDataGrid":true,"labelPosition":"top","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{}}],"tableView":true,"label":"Location","key":"location","protected":false,"persistent":true,"hidden":false,"clearOnHide":true,"type":"datagrid","addAnotherPosition":"bottom","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{},"tooltip":"Please add current location.  This can be used to modify locations over time, if needed."},{"autofocus":false,"input":true,"tree":true,"components":[{"autofocus":false,"input":true,"tableView":true,"inputType":"text","inputMask":"","label":"District","key":"groupFromDistrict","placeholder":"","prefix":"","suffix":"","multiple":false,"defaultValue":"","protected":false,"unique":false,"persistent":true,"hidden":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":false,"minLength":"","maxLength":"","pattern":"","custom":"","customPrivate":false},"conditional":{"show":"","when":null,"eq":""},"type":"textfield","inDataGrid":true,"labelPosition":"top","inputFormat":"plain","tags":[],"properties":{}},{"autofocus":false,"input":true,"tableView":true,"inputType":"text","inputMask":"","label":"State","key":"groupFromState","placeholder":"","prefix":"","suffix":"","multiple":false,"defaultValue":"","protected":false,"unique":false,"persistent":true,"hidden":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":false,"minLength":"","maxLength":"","pattern":"","custom":"","customPrivate":false},"conditional":{"show":"","when":null,"eq":""},"type":"textfield","inDataGrid":true,"labelPosition":"top","inputFormat":"plain","tags":[],"properties":{}}],"tableView":true,"label":"Where is the group from?","key":"groupFrom","protected":false,"persistent":true,"hidden":false,"clearOnHide":true,"type":"datagrid","addAnotherPosition":"bottom","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{},"lockKey":true},{"clearOnHide":false,"key":"panel","input":false,"title":"Current needs","theme":"default","tableView":false,"components":[{"clearOnHide":true,"input":true,"tableView":true,"key":"panelNeedsform","src":"","reference":true,"form":"5e8d20667c06a565e7abcf2b","path":"","label":"Needs form","protected":false,"unique":false,"persistent":true,"type":"form","project":"","labelPosition":"top","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{}}],"type":"panel","breadcrumb":"default","hideLabel":false,"tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{},"tooltip":"Please enter only current needs"},{"autofocus":false,"input":true,"tableView":true,"inputType":"text","inputMask":"","label":"Source","key":"source","placeholder":"","prefix":"","suffix":"","multiple":false,"defaultValue":"","protected":false,"unique":false,"persistent":true,"hidden":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":false,"minLength":"","maxLength":"","pattern":"","custom":"","customPrivate":false},"conditional":{"show":"","when":null,"eq":""},"type":"textfield","labelPosition":"top","inputFormat":"plain","tags":[],"properties":{},"description":"Name of volunteer or organization that sent us this data."},{"autofocus":false,"input":true,"tableView":true,"inputType":"text","inputMask":"","label":"Who is helping them?","key":"whoishelpingthem","placeholder":"","prefix":"","suffix":"","multiple":false,"defaultValue":"","protected":false,"unique":false,"persistent":true,"hidden":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":false,"minLength":"","maxLength":"","pattern":"","custom":"","customPrivate":false},"conditional":{"show":"","when":null,"eq":""},"type":"textfield","labelPosition":"top","inputFormat":"plain","tags":[],"properties":{}},{"autofocus":false,"input":true,"tableView":true,"inputType":"email","label":"Support org email","key":"email","placeholder":"","prefix":"","suffix":"","defaultValue":"","protected":false,"unique":false,"persistent":true,"hidden":false,"clearOnHide":true,"kickbox":{"enabled":false},"type":"email","labelPosition":"top","inputFormat":"plain","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{},"lockKey":true,"multiple":true,"source":"5e8a93462776ff4e9ea73359"},{"clearOnHide":false,"key":"panel2","input":false,"title":"Follow up info","theme":"default","tableView":false,"components":[{"autofocus":false,"input":true,"tableView":true,"label":"What has happened with this group so far?","key":"whathashappenedwiththisgroupsofar","placeholder":"","prefix":"","suffix":"","rows":3,"multiple":false,"defaultValue":"","protected":false,"persistent":true,"hidden":false,"wysiwyg":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":false,"minLength":"","maxLength":"","pattern":"","custom":""},"type":"textarea","labelPosition":"top","inputFormat":"plain","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{},"description":"Notes on help provided, missed opportunities, etc."},{"autofocus":false,"input":true,"tableView":true,"label":"When did the follow up happen?","key":"panel2Whendidthefollowuphappen","placeholder":"","format":"yyyy-MM-dd hh:mm a","enableDate":true,"enableTime":true,"defaultDate":"","datepickerMode":"day","datePicker":{"showWeeks":true,"startingDay":0,"initDate":"","minMode":"day","maxMode":"year","yearRows":4,"yearColumns":5,"minDate":null,"maxDate":null,"datepickerMode":"day"},"timePicker":{"hourStep":1,"minuteStep":1,"showMeridian":true,"readonlyInput":false,"mousewheel":true,"arrowkeys":true},"protected":false,"persistent":true,"hidden":false,"clearOnHide":true,"validate":{"required":false,"custom":""},"type":"datetime","labelPosition":"top","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{}}],"type":"panel","breadcrumb":"default","hideLabel":false,"tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{}},{"autofocus":false,"input":true,"label":"Submit","tableView":false,"key":"submit","size":"md","leftIcon":"","rightIcon":"","block":false,"action":"submit","disableOnInvalid":false,"theme":"primary","type":"button"}],"display":"form","submissionAccess":[{"roles":[],"type":"create_all"},{"roles":["5e8a3d73f1f3d54924170179"],"type":"read_all"},{"roles":["5e8a3d73f1f3d54924170179"],"type":"update_all"},{"roles":["5e8a3d73f1f3d54924170179"],"type":"delete_all"},{"roles":["5e8a3d73f1f3d5492417017a"],"type":"create_own"},{"roles":["5e8a3d73f1f3d5492417017a"],"type":"read_own"},{"roles":["5e8a3d73f1f3d5492417017a"],"type":"update_own"},{"roles":["5e8a3d73f1f3d5492417017a"],"type":"delete_own"}],"title":"Groups seeking help","name":"groupsSeekingHelp","path":"data/helpseeker","access":[{"roles":["5e8a3d73f1f3d54924170179","5e8a3d73f1f3d5492417017a","5e8a3d73f1f3d5492417017b"],"type":"read_all"}],"created":"2020-04-07T23:57:03.580Z","modified":"2020-04-09T08:29:39.977Z","machineName":"helpSeeker"};

        this.json_pre = {
            data: {"groupId":"12345","contactContactperson":{"owner":null,"roles":[],"_id":"5e922b5c32812260855d8280","data":{"fullName":"APPI","mobile":[{"mobileNumber":"(098) 451-5544","mobileWhatsapp":false},{"mobileNumber":"(987) 654-3210","mobileWhatsapp":true}],"phoneLandline":["(098) 451-5544"],"email":["support@gmail.com","additional@gmail.com","third@gmail.com","4@gmail.com"],"regionalLanguages":{"assamese":true,"bengali":false,"gujarati":true,"hindi":false,"kannada":true,"malayalam":false,"manipuri":true,"marathi":false,"oriya":true,"punjabi":false,"tamil":true,"telugu":false,"urudu":true}},"access":[],"form":"5e8d13b27c06a565e7abcf27","externalIds":[],"created":"2020-04-11T20:41:00.277Z","modified":"2020-04-11T20:41:00.278Z"},"locationCurrentlocation":{"owner":null,"roles":[],"_id":"5e922b5c32812260855d8283","data":{"streetaddressorlandmark":"1C, 404, Senswe, Divyashree Elan","cityorvillage":"Bangalore","district":"Bengaluru","state":"Karnataka","howmany":13,"groupDetails":"Testing this entry for prefilling","howmanywomenchildren":7,"locationdate":"2020-04-12T06:30:00.000Z","sheltertype":"on the move"},"access":[],"form":"5e8d1bbe7c06a565e7abcf29","externalIds":[],"created":"2020-04-11T20:41:00.288Z","modified":"2020-04-11T20:41:00.289Z"},"groupFrom":[{"groupFromDistrict":"Koikod","groupFromState":"Kerala"},{"groupFromDistrict":"Surat","groupFromState":"Gujarat"},{"groupFromDistrict":"Jawaja","groupFromState":"Rajasthan"}],"panelNeedsform":{"owner":null,"roles":[],"_id":"5e922b5c32812260855d8282","data":{"needschecklist":{"foodSupplies":false,"shelter":true,"medicalHelp":false,"other":true,"cashAssistance":false,"transportToHome":true,"drinkingWater":false},"describeother":"How does <other> look?","needsdate":"2020-04-12T06:30:00.000Z"},"access":[],"form":"5e8d20667c06a565e7abcf2b","externalIds":[],"created":"2020-04-11T20:41:00.285Z","modified":"2020-04-11T20:41:00.286Z"},"source":"APPI","whoishelpingthem":"CORD","email":["support@gmail.com","additional@gmail.com","third@gmail.com","4@gmail.com"],"whathashappenedwiththisgroupsofar":"1. \n2. \n3.\n4. ","panel2Whendidthefollowuphappen":"2020-04-12T06:30:00.000Z"}
        };
    this.json_pre = {
	    data : {"email": [""], "source": "", "groupId": "rajesh", "groupFrom": [{"groupFromState": "", "groupFromDistrict": ""}], "panelNeedsform": {"_id": "5e92f8df32812260855d8290", "data": {"needsdate": null, "needschecklist": {"other": false, "shelter": false, "medicalHelp": false, "foodSupplies": false, "drinkingWater": false, "cashAssistance": false, "transportToHome": false}}, "form": "5e8d20667c06a565e7abcf2b", "owner": null, "roles": [], "access": [], "created": "2020-04-12T11:17:51.251Z", "modified": "2020-04-12T11:17:51.252Z", "externalIds": []}, "whoishelpingthem": "", "contactContactperson": {"_id": "5e92f8df32812260855d828e", "data": {"email": [""], "mobile": [{"mobileNumber": "(919) 845-0652", "mobileWhatsapp": false}, {"mobileNumber": "(932) 009-8687", "mobileWhatsapp": false}], "fullName": "golani", "phoneLandline": ["(098) 450-6524", "(098) 450-6524"], "regionalLanguages": {"hindi": false, "oriya": false, "tamil": false, "urudu": false, "telugu": false, "bengali": true, "kannada": false, "marathi": false, "punjabi": false, "assamese": true, "gujarati": true, "manipuri": false, "malayalam": false}}, "form": "5e8d13b27c06a565e7abcf27", "owner": null, "roles": [], "access": [], "created": "2020-04-12T11:17:51.246Z", "modified": "2020-04-12T11:17:51.247Z", "externalIds": []}, "locationCurrentlocation": {"_id": "5e92f8df32812260855d828f", "data": {"state": "", "district": "", "sheltertype": "", "groupDetails": "", "locationdate": null, "cityorvillage": "", "streetaddressorlandmark": ""}, "form": "5e8d1bbe7c06a565e7abcf29", "owner": null, "roles": [], "access": [], "created": "2020-04-12T11:17:51.248Z", "modified": "2020-04-12T11:17:51.249Z", "externalIds": []}, "panel2Whendidthefollowuphappen": null, "whathashappenedwiththisgroupsofar": ""} 
    }
    }

    ngOnInit() {
        console.log('Inside ngOnInit()')
        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
            this.setCurrentLocation();
            this.geoCoder = new google.maps.Geocoder;

            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {});
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    //set latitude, longitude and zoom
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.zoom = 12;
                });
            });
        });
    }

    // Get Current Location Coordinates
    private setCurrentLocation() {
        console.log('Inside setCurrentLocation()')
        if (this.address != '' && 'geolocation' in navigator) {
            console.log('geolocation found in navigator')
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('Inside getCurrentLocation()')
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 8;
                this.getAddress(this.latitude, this.longitude);
                console.log(this.latitude, this.longitude, this.zoom)
            }, function(e) {
                console.log('Errored: ')
                console.log(e)
            });
        }
        else {
            console.log("Geolocation is not supported by this browser.");
            alert("Geolocation is not supported by this browser.");
            this.latitude = 28.4720443;
            this.longitude = 77.1329417;
            this.zoom = 15;
        }
    }

    markerDragEnd($event: MouseEvent) {
        console.log($event);
        this.latitude = $event.coords.lat;
        this.longitude = $event.coords.lng;
        this.getAddress(this.latitude, this.longitude);
    }

    getAddress(latitude, longitude) {
        this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 12;
                    this.address = results[0].formatted_address;
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }

    onUpdate($event) {
        console.log(`Inside add-dialog onSubmit(${$event})`);
        console.log($event.data);
        this.data = $event.data;
    }
}
