import { IngredientsService } from './../../../../../services/ingredients.service';
import { Ingredient } from './../../../../../common/ingredient';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-ingredients-result',
  templateUrl: './ingredients-result.component.html',
  styleUrls: ['./ingredients-result.component.css']
})
export class IngredientsResultComponent implements OnInit {

  currentUser: any;
  isSucceded = false;
  isFailed = false;
  errorMessage = '';
  addedRecipeId: number;
  ownRecipe = false;
  searchProductName = '';
  isValid = true;
  form: any = {};
  ingredients: Ingredient[] = [];
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
    this.addedRecipeId = +this._activatedRoute.snapshot.paramMap.get('id');
    this.searchProductName = this._activatedRoute.snapshot.paramMap.get('searchName');
    this.currentUser = this.token.getUser();
    if (this.currentUser) {
      this.checkAuthor();
    }
    if (this.searchProductName !== '') {
      this.getIngredients();
    }
  }

  getIngredients(): void {
    this.ingredientsSerivce.searchIngredients(this.searchProductName).subscribe(
      (data) => {
        this.ingredients = data._embedded.ingredients;
      }
    );
  }

  checkAuthor(): void {
    this.recipeService.getRecipeAuthor(this.addedRecipeId).subscribe(
      (data) => {
        if (data.user_id === this.currentUser.id) {
          this.ownRecipe = true;
        }
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
        ingredient: { "id": this.form.productName },
        amount: this.form.amount,
        unit: this.tempUnit
      };
      this.ingredientsSerivce.addIngredientAmount(ingredientPack).subscribe(
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

  addIngredientToDatabase(): void {
    this.router.navigateByUrl('profil/dodajprodukt');
  }

  returnToAdding(): void {
    this.router.navigateByUrl('profil/dodajskladnik/' + this.addedRecipeId);
  }
}
