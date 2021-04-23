import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/common/user';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { UserDetailsService } from 'src/app/services/userdetails.service';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};
@Component({
  selector: 'app-edit-calories',
  templateUrl: './edit-calories.component.html',
  styleUrls: ['./edit-calories.component.css']
})
export class EditCaloriesComponent implements OnInit {
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

  // chart
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  missingKcal = 0;

  // adding 1 proc
  addend = 0;
  subtrahend = 0;
  constructor(
    // tslint:disable-next-line: variable-name
    private _activatedRoute: ActivatedRoute,
    private userDetailsService: UserDetailsService,
    private tokenStorage: TokenStorageService,
    private userDetials: UserDetailsService
  ) {
  }
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
    console.log(this.calProc);
    const regex = new RegExp(/^\d*$/);
    if (!regex.test(this.form.calories) && this.form.calories !== null) {
      this.form.calories.invalid = true;
      this.form.calories.errors.pattern = true;
    } else if (!regex.test(this.form.fat) && this.form.fat !== null) {
      this.form.fat.invalid = true;
      this.form.fat.errors.pattern = true;
    } else if (!regex.test(this.form.carbohydrates) && this.form.carbohydrates !== null) {
      this.form.carbohydrates.invalid = true;
      this.form.carbohydrates.errors.pattern = true;
    } else if (!regex.test(this.form.proteins) && this.form.proteins !== null) {
      this.form.proteins.invalid = true;
      this.form.proteins.errors.pattern = true;
    } else if (this.calProc !== 100 && this.form.calories !== null && this.form.fat && this.form.carbohydrates && this.form.proteins) {
      this.proc = true;
    } else if (this.form.calories < 1000) {
    } else {
      const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
      // tslint:disable-next-line: deprecation
      this.userDetailsService.updateUserCalories(id, this.form).subscribe(
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
        this.caloriesChange(this.form.calories);
      });
  }

  // tslint:disable-next-line: typedef
  caloriesChange(newValue) {
    this.calProt = (this.form.proteins * 4) / this.form.calories;
    this.calFat = (this.form.fat * 9) / this.form.calories;
    this.calCarb = (this.form.carbohydrates * 4) / this.form.calories;
    this.calProc = this.calProc * 100;
    this.calProt = this.calProt * 100;
    this.calFat = this.calFat * 100;
    this.calCarb = this.calCarb * 100;
    this.calProt = Math.round(this.calProt);
    this.calFat = Math.round(this.calFat);
    this.calCarb = Math.round(this.calCarb);
    this.calProc = this.calProt + this.calFat + this.calCarb;
    this.missingKcal = (100 - (this.calCarb + this.calFat + this.calProt));
    if (this.calProc === 100) {
      this.proc = false;
    } else if (this.calProc !== 100 && this.form.fat && this.form.carbohydrates && this.form.proteins) {
      this.proc = true;
    }
    else if (!this.form.fat || !this.form.carbohydrates || !this.form.proteins) {
      this.proc = false;
    }
    this.valueChange();
  }

  // tslint:disable-next-line: typedef
  setExampleCalories() {
    this.form.proteins = Math.round((this.form.calories * 0.25) / 4);
    this.form.fat = Math.round((this.form.calories * 0.25) / 9);
    this.form.carbohydrates = Math.round((this.form.calories * 0.5) / 4);
    this.caloriesChange(this.form.calories);
  }

  // tslint:disable-next-line: typedef
  valueChange() {
    this.chartOptions = {
      series: [this.calCarb, this.calFat, this.calProt, this.missingKcal],
      chart: {
        type: 'donut'
      },
      labels: ['Węglowodany', 'Tłuszcze', 'Białko', 'Brakujące'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }

  // tslint:disable-next-line: typedef
  addPercentP() {
    this.addend = Math.round((this.form.calories / 4) / 100);
    this.form.proteins += this.addend;
    this.caloriesChange(this.form.calories);
  }

  // tslint:disable-next-line: typedef
  minusPercentP() {
    this.subtrahend = Math.round((this.form.calories / 4) / 100);
    this.form.proteins -= this.addend;
    this.caloriesChange(this.form.calories);
  }

  // tslint:disable-next-line: typedef
  addPercentW() {
    this.addend = Math.floor((this.form.calories / 4) / 100);
    this.form.carbohydrates += this.addend;
    this.caloriesChange(this.form.calories);
  }

  // tslint:disable-next-line: typedef
  minusPercentW() {
    this.subtrahend = Math.round((this.form.calories / 4) / 100);
    this.form.carbohydrates -= this.addend;
    this.caloriesChange(this.form.calories);
  }

  // tslint:disable-next-line: typedef
  addPercentF() {
    this.addend = Math.floor((this.form.calories / 9) / 100);
    this.form.fat += this.addend;
    this.caloriesChange(this.form.calories);
  }

  // tslint:disable-next-line: typedef
  minusPercentF() {
    this.subtrahend = Math.round((this.form.calories / 9) / 100);
    this.form.fat -= this.addend;
    this.caloriesChange(this.form.calories);
  }
}
