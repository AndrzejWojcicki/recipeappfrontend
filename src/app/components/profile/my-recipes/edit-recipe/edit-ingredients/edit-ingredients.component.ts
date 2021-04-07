import { IngredientsForRecipe } from './../../../../../common/ingredients-for-recipe';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { IngredientsService } from 'src/app/services/ingredients.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { Ingredient } from 'src/app/common/ingredient';

@Component({
  selector: 'app-edit-ingredients',
  templateUrl: './edit-ingredients.component.html',
  styleUrls: ['./edit-ingredients.component.css']
})
export class EditIngredientsComponent implements OnInit {

  currentUser: any;
  isSucceded = false;
  isFailed = false;
  errorMessage = '';
  addedRecipeId: number;
  addedIngredient: number;
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
    private recipeService: RecipeService,
    private ingredientsSerivce: IngredientsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.addedRecipeId = +this._activatedRoute.snapshot.paramMap.get('recipeId');
    this.addedIngredient = +this._activatedRoute.snapshot.paramMap.get('id');
    this.currentUser = this.token.getUser();
    if (this.currentUser) {
      this.checkAuthor();
    }
    if (this.addedIngredient) {
      this.getIngredientAmountInfo();
      this.getIngredientInfo();
    }
  }

  checkAuthor(): void {
    // tslint:disable-next-line: deprecation
    this.recipeService.getRecipeAuthor(this.addedRecipeId).subscribe(
      (data) => {
        if (data.user_id === this.currentUser.id) {
          this.ownRecipe = true;
        }
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



  getIngredientAmountInfo(): void {
    // tslint:disable-next-line: deprecation
    this.ingredientsSerivce.getIngredientAmountData(this.addedIngredient).subscribe(
      (data) => {
        this.form.amount = data.amount;
        this.form.unit = this.toUnit(data.unit);
      }
    );
  }

  getIngredientInfo(): void {
    // tslint:disable-next-line: deprecation
    this.ingredientsSerivce.getIngredientData(this.addedIngredient).subscribe(
      (data) => {
        this.ingredient = data;
      }
    );
  }

  onSubmit(): void {
    const regex = new RegExp(/^\d*(\.\d(\d)?)?$/);
    if (regex.test(this.form.amount)) {
      this.unitTranslation();
      const ingredientPack = {
        // tslint:disable-next-line: quotemark object-literal-key-quotes
        recipe: { "id": this.addedRecipeId },
        // tslint:disable-next-line: quotemark object-literal-key-quotes
        ingredient: { "id": this.ingredient.id },
        amount: this.form.amount,
        unit: this.tempUnit
      };

      // tslint:disable-next-line: deprecation
      this.ingredientsSerivce.updateIngredient(this.addedIngredient, ingredientPack).subscribe(
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

  returnToRecipe(): void {
    this.router.navigateByUrl('przepisy/' + this.addedRecipeId);
  }
}
