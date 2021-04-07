import { IngredientsService } from './../../../services/ingredients.service';
import { DietsService } from 'src/app/services/diet.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { Ingredient } from 'src/app/common/ingredient';

@Component({
  selector: 'app-edit-diet',
  templateUrl: './edit-diet.component.html',
  styleUrls: ['./edit-diet.component.css']
})
export class EditDietComponent implements OnInit {

  currentUser: any;
  isSucceded = false;
  isFailed = false;
  errorMessage = '';
  addedDiet: number;
  ownRecipe = false;
  ingredient = new Ingredient();
  form: any = {};
  tempUnit = '';
  units = [
    'g',
    'dag',
    'kg',
    'ml',
    'l',
    'łyżeczka',
    'łyżka',
    'ząbek',
    'szklanka',
    'szczypta',
    'pęczek'
  ];


  constructor(
    // tslint:disable-next-line: variable-name
    private _activatedRoute: ActivatedRoute,
    private token: TokenStorageService,
    private dietSerivce: DietsService,
    private ingredientsSerivce: IngredientsService,
    private router: Router) { }

  ngOnInit(): void {
    this.addedDiet = +this._activatedRoute.snapshot.paramMap.get('id');
    this.currentUser = this.token.getUser();
    this.getIngredientAmountInfo();
    this.getIngredientInfo();
  }

  getIngredientAmountInfo(): void {
    // tslint:disable-next-line: deprecation
    this.dietSerivce.getAmountIngredient(this.addedDiet).subscribe(
      (data) => {
        this.form.amount = data.amount;
        this.form.unit = this.toUnit(data.unit);
      }
    );
  }

  getIngredientInfo(): void {
    // tslint:disable-next-line: deprecation
    this.dietSerivce.getIngredient(this.addedDiet).subscribe(
      (data) => {
        this.ingredient = data;
      }
    );
  }

  // tslint:disable-next-line: typedef
  toUnit(unit: string) {
    if (unit.includes('łyżeczka')
      || unit.includes('łyżeczki')
      || unit.includes('łyżeczek')) {
      return 'łyżeczka';
    }
    else if (unit.includes('łyżka')
      || unit.includes('łyżki')
      || unit.includes('łyżek')
    ) {
      return 'łyżka';
    }
    else if (unit.includes('ząb')
    ) {
      return 'ząbek';
    }
    else if (unit.includes('szklan')
    ) {
      return 'szklanka';
    }
    else if (unit.includes('szczypt')
    ) {
      return 'szczypta';
    }
    else if (unit.includes('pęcz')
    ) {
      return 'pęczek';
    }
    else if (unit.includes('kg')
    ) {
      return 'kg';
    }
    else if (unit.includes('dag')
    ) {
      return 'dag';
    }
    else if (unit.includes('g')
    ) {
      return 'g';
    }
    else if (unit.includes('ml')
    ) {
      return 'ml';
    }
    else if (unit.includes('l')
    ) {
      return 'l';
    }
  }

  onSubmit(): void {
    const regex = new RegExp(/^\d*(\.\d(\d)?)?$/);
    if (regex.test(this.form.amount)) {
      this.unitTranslation();
      const dietPack = {
        // tslint:disable-next-line: quotemark object-literal-key-quotes
        user: { "user_id": this.currentUser.id },
        // tslint:disable-next-line: quotemark object-literal-key-quotes
        ingredient: { "id": this.ingredient.id },
        amount: this.form.amount,
        unit: this.tempUnit
      };

      // tslint:disable-next-line: deprecation
      this.dietSerivce.updateDiet(this.addedDiet, dietPack).subscribe(
        (response) => {
          console.log(response);
          this.isSucceded = true;
        },
        (error) => {
          console.log(error);
          this.isFailed = true;
          this.errorMessage = error.error.message;
        }
      );
    }
    else {
      this.form.amount.invalid = true;
      this.form.amount.errors.pattern = true;
    }
  }

  // tslint:disable-next-line: typedef
  unitTranslation() {
    if (this.form.unit === 'łyżeczka' && this.form.amount === 1) {
      this.tempUnit = 'łyżeczka';
    }
    else if ((this.form.unit === 'łyżeczka' && this.form.amount > 1 && this.form.amount < 5)
      || (this.form.unit === 'łyżeczka' && this.form.amount < 1)) {
      this.tempUnit = 'łyżeczki';
    }
    else if (this.form.unit === 'łyżeczka' && this.form.amount >= 5) {
      this.tempUnit = 'łyżeczek';
    }
    else if (this.form.unit === 'łyżka' && this.form.amount === 1) {
      this.tempUnit = 'łyżka';
    }
    else if (this.form.unit === 'łyżka' && this.form.amount > 1 && this.form.amount < 5
      || (this.form.unit === 'łyżka' && this.form.amount < 1)) {
      this.tempUnit = 'łyżki';
    }
    else if (this.form.unit === 'łyżka' && this.form.amount >= 5) {
      this.tempUnit = 'łyżek';
    }
    else if (this.form.unit === 'ząbek' && this.form.amount === 1) {
      this.tempUnit = 'ząbek';
    }
    else if (this.form.unit === 'ząbek' && this.form.amount > 1 && this.form.amount < 5) {
      this.tempUnit = 'ząbki';
    }
    else if (this.form.unit === 'ząbek' && this.form.amount >= 5
      || (this.form.unit === 'ząbek' && this.form.amount < 1)) {
      this.tempUnit = 'ząbków';
    }
    else if (this.form.unit === 'szklanka' && this.form.amount === 1) {
      this.tempUnit = 'szklanka';
    }
    else if (this.form.unit === 'szklanka' && this.form.amount > 1 && this.form.amount < 5
      || (this.form.unit === 'szklanka' && this.form.amount < 1)) {
      this.tempUnit = 'szklanki';
    }
    else if (this.form.unit === 'szklanka' && this.form.amount >= 5) {
      this.tempUnit = 'szklanek';
    }
    else if (this.form.unit === 'szczypta' && this.form.amount === 1) {
      this.tempUnit = 'szczypta';
    }
    else if (this.form.unit === 'szczypta' && this.form.amount > 1 && this.form.amount < 5
      || (this.form.unit === 'szczypta' && this.form.amount < 1)) {
      this.tempUnit = 'szczypty';
    }
    else if (this.form.unit === 'szczypta' && this.form.amount >= 5) {
      this.tempUnit = 'szczypt';
    }
    else if (this.form.unit === 'pęczek' && this.form.amount === 1) {
      this.tempUnit = 'pęczek';
    }
    else if (this.form.unit === 'pęczek' && this.form.amount > 1 && this.form.amount < 5) {
      this.tempUnit = 'pęczki';
    }
    else if (this.form.unit === 'pęczek' && this.form.amount >= 5
      || (this.form.unit === 'pęczek' && this.form.amount < 1)) {
      this.tempUnit = 'pęczków';
    }
    else if (this.form.unit === 'kg') {
      this.tempUnit = 'kg';
    }
    else if (this.form.unit === 'dag') {
      this.tempUnit = 'dag';
    }
    else if (this.form.unit === 'g') {
      this.tempUnit = 'g';
    }
    else if (this.form.unit === 'ml') {
      this.tempUnit = 'ml';
    }
    else if (this.form.unit === 'l') {
      this.tempUnit = 'l';
    }
  }

  returnToDiet(): void {
    this.router.navigateByUrl('profil/dieta');
  }
}
