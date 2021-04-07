import { User } from './../../common/user';
import { UserDetailsService } from './../../services/userdetails.service';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  user: User = new User();

  constructor(
    private token: TokenStorageService,
    private userDetials: UserDetailsService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.userDetials
      .getUserDetials(this.currentUser.username)
      .subscribe((data) => {
        this.user = data;
      });
  }
}
