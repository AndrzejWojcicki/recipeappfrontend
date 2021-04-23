import { TokenStorageService } from './../../../services/authentication/token-storage.service';
import { UserDetailsService } from './../../../services/userdetails.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/common/user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  form: any = {};
  currentUser: any;
  isSuccessful = false;
  isEditFailed = false;
  errorMessage = '';
  user: User = new User();
  ownProfile = false;
  proc = false;

  // percentages
  calProc = 0;
  calProt = 0;
  calFat = 0;
  calCarb = 0;

  constructor(
    // tslint:disable-next-line: variable-name
    private _activatedRoute: ActivatedRoute,
    private userDetailsService: UserDetailsService,
    private tokenStorage: TokenStorageService,
    private userDetials: UserDetailsService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser();
    this.getUserInfo();
    if (this.currentUser) {
      this.checkAuthor();
    }
  }

  checkAuthor(): void {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    this.userDetailsService.getUser(id).subscribe(
      (data) => {
        if (data.user_id === this.currentUser.id) {
          this.ownProfile = true;
        }
      }
    );
  }

  onSubmit(): void {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    // tslint:disable-next-line: deprecation
    this.userDetailsService.updateUser(id, this.form).subscribe(
      (data) => {
        this.isSuccessful = true;
        this.isEditFailed = false;
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isEditFailed = true;
      }
    );
  }

  getUserInfo(): void {
    this.userDetials
      .getUserDetials(this.currentUser.username)
      // tslint:disable-next-line: deprecation
      .subscribe((data) => {
        this.user = data;
        this.form.userName = this.user.userName;
        this.form.firstName = this.user.firstName;
        this.form.lastName = this.user.lastName;
        this.form.calories = this.user.calories;
        this.form.fat = this.user.fat;
        this.form.carbohydrates = this.user.carbohydrates;
        this.form.proteins = this.user.proteins;
      });
  }

  // tslint:disable-next-line: typedef
  caloriesChange(newValue) {
    this.calProc = ((this.form.fat * 9) + (this.form.carbohydrates * 4) + (this.form.proteins * 4)) / this.form.calories;
    this.calProt = (this.form.proteins * 4) / this.form.calories;
    this.calFat = (this.form.fat * 9) / this.form.calories;
    this.calCarb = (this.form.carbohydrates * 4) / this.form.calories;
    this.calProc = this.calProc * 100;
    this.calProt = this.calProt * 100;
    this.calFat = this.calFat * 100;
    this.calCarb = this.calCarb * 100;
    this.calProc = Math.round(this.calProc);
    this.calProt = Math.round(this.calProt);
    this.calFat = Math.round(this.calFat);
    this.calCarb = Math.round(this.calCarb);
  }
}
