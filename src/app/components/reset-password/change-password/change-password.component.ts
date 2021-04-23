import { User } from './../../../common/user';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { UserDetailsService } from 'src/app/services/userdetails.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  form: any = {};
  user: User = new User();
  isChanged = false;
  token: string;
  isTokenValid = false;
  isChangeFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    // tslint:disable-next-line: variable-name
    private _activatedRoute: ActivatedRoute,
    private userService: UserDetailsService,
    private tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.token = this._activatedRoute.snapshot.paramMap.get('token');
    if (this.tokenStorageService.getToken()) {
      this.isChanged = true;
    }
    this.userService.checkPasswordToken(this.token).subscribe((data) => {
      this.user = data;
      this.isTokenValid = true;
    });
  }

  onSubmit(): void {
    const json = {
      id: this.user.user_id,
      password: this.form.password
    };
    this.userService.changePassword(json).subscribe((data) => {
      this.isChangeFailed = false;
      this.isChanged = true;
    },
      (err) => {
        console.log(err);
        this.isChangeFailed = true;
      }
    );
  }
}


