import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-avatar-edit',
  templateUrl: './avatar-edit.component.html',
  styleUrls: ['./avatar-edit.component.css']
})
export class AvatarEditComponent implements OnInit {
  name: string;
  avatar: File;
  endpoint = environment.apiURL+"/api/user/modify/profile/";
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
  onNameChanged(event: any) {
    this.name = event.target.value;
    console.log(this.name)
  }

  onImageChanged(event: any) {
    this.avatar = event.target.files[0];
  }
  editAvatar() {
    const uploadData = new FormData();
    uploadData.append('name', this.name);
    uploadData.append('avatar', this.avatar, this.avatar.name);
    console.log(this.endpoint);
    this.http.patch(this.endpoint, uploadData).subscribe(
      data => console.log(data),
      error => console.log(error)
    );
  }
}
