import { TokenStorageService } from './../../services/authentication/token-storage.service';
import { AuthService } from './../../services/authentication/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorageService.getUser().roles;
      this.authService.isLoggedIn = true;
    }
  }

  onSubmit(): void {
    // tslint:disable-next-line: deprecation
    this.authService.login(this.form).subscribe(
      (data) => {
        this.tokenStorageService.saveToken(data.accessToken);
        this.tokenStorageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.reloadPage();
      },
      (err) => {
        console.log(err);
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    this.authService.isLoggedIn = true;
    window.location.reload();
  }
}
