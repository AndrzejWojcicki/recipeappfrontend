import { UserDetailsService } from 'src/app/services/userdetails.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  form: any = {};
  isReseted = false;
  isResetFailed = false;
  errorMessage = '';
  roles: string[] = [];
  resetUrl = 'https://recipe-app-us.herokuapp.com/reset/reset_password';

  constructor(
    private userService: UserDetailsService,
    private tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      this.isReseted = true;
    }
  }

  onSubmit(): void {
    const json = {
      email: this.form.email,
      url: this.resetUrl,
    };
    console.log(json);
    this.userService.processForgotPassword(json).subscribe(
      (data) => {
        this.isResetFailed = false;
        this.isReseted = true;
      },
      (err) => {
        console.log(err);
        this.isResetFailed = true;
      }
    );
  }
}
