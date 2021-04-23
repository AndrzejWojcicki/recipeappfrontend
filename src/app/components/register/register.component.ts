import { AuthService } from './../../services/authentication/auth.service';
import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { UserDetailsService } from 'src/app/services/userdetails.service';
import { User } from 'src/app/common/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  currentUser: any = new Object();
  user: User = new User();
  // tslint:disable-next-line: no-shadowed-variable
  constructor(
    // tslint:disable-next-line: no-shadowed-variable
    private AuthService: AuthService,
    private token: TokenStorageService,
    private userDetials: UserDetailsService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    console.log(this.currentUser);
    this.getUserInfo();
  }
  getUserInfo(): void {
    if (this.currentUser) {
      this.userDetials
        .getUserDetials(this.currentUser.username)
        .subscribe((data) => {
          this.user = data;
        });
    }
  }
  onSubmit(): void {
    this.AuthService.register(this.form).subscribe(
      (data) => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
