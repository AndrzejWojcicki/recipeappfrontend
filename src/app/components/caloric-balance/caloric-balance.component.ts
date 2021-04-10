import { Ingredient } from './../../common/ingredient';
import { UserDiet } from './../../common/userdiet';
import { DietsService } from './../../services/diet.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/common/user';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { UserDetailsService } from 'src/app/services/userdetails.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-caloric-balance',
  templateUrl: './caloric-balance.component.html',
  styleUrls: ['./caloric-balance.component.css']
})
export class CaloricBalanceComponent implements OnInit {

  currentUser: any;
  user: User = new User();
  tempIA: UserDiet[] = new Array();

  procCalories = 0;
  procFat = 0;
  procProteins = 0;
  procCarbs = 0;

  temporary = 0;
  totalCalories = 0;
  totalProteins = 0;
  totalFat = 0;
  totalCarbs = 0;
  productCalories = 0;
  productProteins = 0;
  productFat = 0;
  productCarbs = 0;
  grams = 0;
  caloricValue = 0;
  proteins = 0;
  fat = 0;
  carbs = 0;
  tempArray = new Array();
  ingredient = new Array();

  constructor(
    private token: TokenStorageService,
    private userDetials: UserDetailsService,
    private dietService: DietsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.getUserInfo();
    this.getRecipeIngredientsAmount();
  }

  getUserInfo(): void {
    this.userDetials
      .getUserDetials(this.currentUser.username)
      .subscribe((data) => {
        this.user = data;
      });
  }

  // tslint:disable-next-line: typedef
  getRecipeIngredientsAmount() {
    this.dietService.getAmountIngredients(this.currentUser.id).subscribe((data) => {
      data.sort((a: UserDiet, b: UserDiet) =>
        a.id > b.id ? 1 : -1
      );
      this.tempIA = data;
      this.tempIA.forEach((amount) =>
        // tslint:disable-next-line: no-shadowed-variable
        this.dietService.getIngredient(amount.id).subscribe((ingredient) => {
          this.dietService.getDietIngredientId(amount.id, ingredient.id).subscribe((userDietPack) => {
            this.tempArray.push(userDietPack);
            this.tempArray.sort((a, b) => // tslint:disable-next-line: no-unused-expression
              // tslint:disable-next-line: no-unused-expression
              // tslint:disable-next-line: no-unused-expression
              // tslint:disable-next-line: no-unused-expression
              // tslint:disable-next-line: no-unused-expression
              // tslint:disable-next-line: no-unused-expression
              // tslint:disable-next-line: no-unused-expression
              (a.diet.id > b.diet.id) ? 1 : -1);
            // tslint:disable-next-line: no-shadowed-variable
            this.calculate(userDietPack.ingredient, userDietPack.diet);
            this.procCalories = Math.round((this.totalCalories / this.user.calories) * 100);
            this.procProteins = Math.round((this.totalProteins / this.user.proteins) * 100);
            this.procFat = Math.round((this.totalFat / this.user.fat) * 100);
            this.procCarbs = Math.round((this.totalCarbs / this.user.carbohydrates) * 100);
          });
        })
      );
    });
  }

  // tslint:disable-next-line: typedef
  round(data, text: string) {
    this.productCalories = ((this.toGrams(data.diet) * data.diet.amount) / 100) * data.ingredient.calories;
    this.productCalories = Math.round(this.productCalories);
    if (text === 'kalorie') {
      return this.productCalories;
    }
    this.productProteins = ((this.toGrams(data.diet) * data.diet.amount) / 100) * data.ingredient.proteins;
    this.productProteins = Math.round(this.productProteins);
    if (text === 'bialko') {
      return this.productProteins;
    }
    this.productFat = ((this.toGrams(data.diet) * data.diet.amount) / 100) * data.ingredient.fat;
    this.productFat = Math.round(this.productFat);
    if (text === 'tluszcz') {
      return this.productFat;
    }
    this.productCarbs = ((this.toGrams(data.diet) * data.diet.amount) / 100) * data.ingredient.carbohydrates;
    this.productCarbs = Math.round(this.productCarbs);
    if (text === 'wegle') {
      return this.productCarbs;
    }
  }

  // tslint:disable-next-line: typedef
  calculate(temp: Ingredient, amount: UserDiet) {
    this.grams = this.toGrams(amount);
    this.temporary = (amount.amount * this.grams);
    this.temporary = this.temporary / 100;
    this.totalCalories = this.totalCalories + (this.temporary * temp.calories);
    this.totalCalories = Math.round(this.totalCalories);
    this.totalCarbs = this.totalCarbs + (this.temporary * temp.carbohydrates);
    this.totalCarbs = Math.round(this.totalCarbs);
    this.totalFat = this.totalFat + (this.temporary * temp.fat);
    this.totalFat = Math.round(this.totalFat);
    this.totalProteins = this.totalProteins + (this.temporary * temp.proteins);
    this.totalProteins = Math.round(this.totalProteins);
  }

  // tslint:disable-next-line: typedef
  toGrams(amount) {
    if (amount.unit.includes('łyżeczka')
      || amount.unit.includes('łyżeczki')
      || amount.unit.includes('łyżeczek')) {
      return 5;
    }
    else if (amount.unit.includes('łyżka')
      || amount.unit.includes('łyżki')
      || amount.unit.includes('łyżek')
    ) {
      return 15;
    }
    else if (amount.unit.includes('ząb')
    ) {
      return 5;
    }
    else if (amount.unit.includes('szklan')
    ) {
      return 250;
    }
    else if (amount.unit.includes('szczypt')
    ) {
      return 1;
    }
    else if (amount.unit.includes('pęcz')
    ) {
      return 25;
    }
    else if (amount.unit.includes('kg')
    ) {
      return 1000;
    }
    else if (amount.unit.includes('dag')
    ) {
      return 10;
    }
    else if (amount.unit.includes('g')
    ) {
      return 1;
    }
    else if (amount.unit.includes('ml')
    ) {
      return 1;
    }
    else if (amount.unit.includes('l')
    ) {
      return 1000;
    }
  }

  deleteUserDiet(userDietId): void {
    this.dietService.deleteDiet(userDietId).subscribe(response => {
      console.log(response);
      window.location.reload();
    },
      error => {
        console.log(error);
      });
  }

  editUserDiet(dietId: number): void {
    this.router.navigateByUrl('profil/dieta/edytuj/' + dietId);
  }

  addToDiet(): void {
    this.router.navigateByUrl('profil/dieta/dodajprodukt');
  }

  deleteAll(): void {
    this.tempArray.forEach((diet) =>
      this.dietService.deleteDiet(diet.diet.id).subscribe(response => {
        console.log(response);
        window.location.reload();
      },
        error => {
          console.log(error);
        })
    );
  }

  goToUserEdit(): void {
    this.router.navigateByUrl('profil/edit/' + this.currentUser.id);
  }
}
