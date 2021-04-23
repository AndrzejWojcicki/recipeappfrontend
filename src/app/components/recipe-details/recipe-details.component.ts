import { IngredientsService } from './../../services/ingredients.service';
import { StepsService } from 'src/app/services/steps.service';
import { RatingService } from './../../services/rating.service';
import { CommentsService } from './../../services/comments.service';
import { IngredientsForRecipe } from './../../common/ingredients-for-recipe';
import { Rating } from './../../common/rating';
import { Comment } from 'src/app/common/comment';
import { RecipeSteps } from './../../common/recipe_step';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Recipe } from 'src/app/common/recipe';
import { RecipeService } from 'src/app/services/recipe.service';
import { User } from 'src/app/common/user';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { Ingredient } from 'src/app/common/ingredient';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { ShoppingListService } from 'src/app/services/shoppingList.service';
import { DietsService } from 'src/app/services/diet.service';
import { NgxSpinnerService } from 'ngx-spinner';

registerLocaleData(localePl, 'pl');

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css'],
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Recipe = new Recipe();
  steps: RecipeSteps[] = new Array();
  comments: Comment[] = new Array();
  authorofComment: User;
  authorofRecipe: string;
  ratings: Rating[] = new Array();
  total = 0;
  avgRatings: number;
  tempIA: IngredientsForRecipe[] = new Array();
  ingredientsAmount: IngredientsForRecipe[] = new Array();
  ingredient: Ingredient[] = new Array();
  user;
  tempArray = new Array();
  screenHeight: number;
  screenWidth: number;

  // comments checking section
  message: string;
  username = '';

  // check log in
  isLoggedIn = false;

  // rating
  currentRate = 0;
  rateAdded = false;
  userRateId: number;

  //
  temporary = 0;
  totalCalories = 0;
  totalProteins = 0;
  totalFat = 0;
  totalCarbs = 0;
  grams = 0;
  caloricValue = 0;
  proteins = 0;
  fat = 0;
  carbs = 0;

  @HostListener('window:resize', ['$event'])
  // tslint:disable-next-line: typedef
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    console.log(this.screenHeight, this.screenWidth);
  }

  constructor(
    // tslint:disable-next-line: variable-name
    private _activatedRoute: ActivatedRoute,
    // tslint:disable-next-line: variable-name
    private _recipeService: RecipeService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private commentService: CommentsService,
    private ratingService: RatingService,
    private stepService: StepsService,
    private ingredietService: IngredientsService,
    private shoppingListService: ShoppingListService,
    private dietService: DietsService,
    // tslint:disable-next-line: variable-name
    private _spinnerService: NgxSpinnerService
  ) { this.getScreenSize(); }

  ngOnInit(): void {
    this.user = this.tokenStorage.getUser();
    if (this.user) {
      this.username = this.user.username;
      this.isLoggedIn = true;
    }
    // tslint:disable-next-line: deprecation
    // tslint:disable-next-line: deprecation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
        const user2 = this.tokenStorage.getUser();
        if (this.user) {
          this.isLoggedIn = true;
          this.username = user2.username;
        }
      }
    });
    // tslint:disable-next-line: label-position
    const data = '';
    // tslint:disable-next-line: deprecation
    this._activatedRoute.paramMap.subscribe(() => {
      this._spinnerService.show();
      this.getRecipeInfo();
      this.getRecipeSteps();
      this.getRecipeComments();
      this.getRecipeRatings();
      this.getRecipeAuthor();
      this.getRecipeIngredientsAmount();
    });
  }

  // tslint:disable-next-line: typedef
  getRecipeSteps() {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    // tslint:disable-next-line: deprecation
    this._recipeService.getRecipeSteps(id).subscribe((data) => {
      data.sort((a: RecipeSteps, b: RecipeSteps) =>
        a.stepNumber > b.stepNumber ? 1 : -1
      );
      this.steps = data;
    });
  }

  // tslint:disable-next-line: typedef
  getRecipeComments() {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    // tslint:disable-next-line: deprecation
    this._recipeService.getRecipeComments(id).subscribe((data) => {
      data.forEach((comment) =>
        this.getCommentAuthor(comment.comment_id)
      );
    });
  }

  // tslint:disable-next-line: typedef
  getCommentAuthor(commentId: number) {
    // tslint:disable-next-line: deprecation
    this.commentService.getComment(commentId).subscribe((data) => {
      this.comments.push(data);
      this.comments.sort((a: Comment, b: Comment) =>
        a.dateCreated > b.dateCreated ? 1 : -1
      );
    });
  }

  // tslint:disable-next-line: typedef
  getRecipeRatings() {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    // tslint:disable-next-line: deprecation
    this._recipeService.getRecipeRatings(id).subscribe((data) => {
      this.ratings = data;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.ratings.length; i++) {
        this.total += this.ratings[i].value;
        this.compareRatingAuthor(this.ratings[i].rating_id);
      }
      this.avgRatings = Math.round((this.total / this.ratings.length) * 10) / 10;
      if (Number.isNaN(this.avgRatings)) {
        this.avgRatings = 0;
      }
    });
  }

  compareRatingAuthor(ratingId: number): void {
    // tslint:disable-next-line: deprecation
    this.ratingService.getRatingAuthor(ratingId).subscribe((data) => {
      if (this.username === data.userName) {
        this.rateAdded = true;
        this.getRating(ratingId);
        this.userRateId = ratingId;
      }
    });
  }

  getRating(ratingId: number): void {
    // tslint:disable-next-line: deprecation
    this.ratingService.getRating(ratingId).subscribe((data) => {
      this.currentRate = data.value;
    });
  }

  addRate(ratingValue: number): void {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    const ratePack = {
      // tslint:disable-next-line: object-literal-key-quotes quotemark
      user: { "user_id": this.user.id },
      // tslint:disable-next-line: object-literal-key-quotes quotemark
      recipe: { "id": id },
      value: this.currentRate
    };
    // tslint:disable-next-line: deprecation
    this.ratingService.addRate(ratePack).subscribe(
      (response) => {
        console.log(response);
        this.reloadPage();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editRate(ratingValue: number): void {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    const ratePack = {
      // tslint:disable-next-line: object-literal-key-quotes quotemark
      user: { "user_id": this.user.id },
      // tslint:disable-next-line: object-literal-key-quotes quotemark
      recipe: { "id": id },
      value: this.currentRate
    };

    // tslint:disable-next-line: deprecation
    this.ratingService.updateRate(this.userRateId, ratePack).subscribe(
      (response) => {
        console.log(response);
        this.reloadPage();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteRate(): void {
    // tslint:disable-next-line: deprecation
    this.ratingService.deleteRate(this.userRateId).subscribe(
      (response) => {
        console.log(response);
        this.reloadPage();
      },
      (error) => {
        console.log(error);
      }
    );
  }


  // tslint:disable-next-line: typedef
  getRecipeAuthor() {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    // tslint:disable-next-line: deprecation
    this._recipeService.getRecipeAuthor(id).subscribe((data) => {
      this.authorofRecipe = data.userName;
    });
  }

  // tslint:disable-next-line: typedef
  getRecipeInfo() {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    // tslint:disable-next-line: deprecation
    this._recipeService.get(id).subscribe((data) => {
      this.recipe = data;
    });
  }

  // tslint:disable-next-line: typedef
  getRecipeIngredientsAmount() {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    this._recipeService.getAmountIngredients(id).subscribe((data) => {
      data.sort((a: IngredientsForRecipe, b: IngredientsForRecipe) =>
        a.id > b.id ? 1 : -1
      );
      this.tempIA = data;
      if (this.tempIA.length === 0) {
        this._spinnerService.hide();
      }
      this.tempIA.forEach((ingredient) =>
        // tslint:disable-next-line: no-shadowed-variable
        this._recipeService.getIngredient(ingredient.id).subscribe((data) => {
          // tslint:disable-next-line: no-shadowed-variable
          this._recipeService.getRecipeIngredientId(ingredient.id, data.id).subscribe((data) => {
            this.tempArray.push(data);
            this.ingredientsAmount.push(data.amount);
            this.calculate(data.ingredient, data.amount);
            this.ingredient.push(data.ingredient);
            this._spinnerService.hide();
          });
        })
      );
    });

  }

  // tslint:disable-next-line: typedef
  calculate(temp: Ingredient, amount: IngredientsForRecipe) {
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
  toGrams(amount: IngredientsForRecipe) {
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

  addComment(message): void {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    const commentPack = {
      // tslint:disable-next-line: quotemark object-literal-key-quotes
      author: { "user_id": this.user.id },
      // tslint:disable-next-line: quotemark object-literal-key-quotes
      recipe: { "id": id },
      // tslint:disable-next-line: object-literal-key-quotes
      message: message.value
    };
    // tslint:disable-next-line: deprecation
    this.commentService.addComent(commentPack).subscribe(
      (response) => {
        console.log(response);
        this.reloadPage();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  deleteComment(commentId: number): void {
    // tslint:disable-next-line: deprecation
    this.commentService.deleteComent(commentId).subscribe(
      response => {
        console.log(response);
        this.reloadPage();
      },
      error => {
        console.log(error);
      });
  }

  recipeDetailsEdit(): void {
    this.router.navigateByUrl('profil/mojeprzepisy/edytuj/' + this.recipe.id);
  }

  ingredientAdd(): void {
    this.router.navigateByUrl('profil/dodajskladnik/' + this.recipe.id);
  }

  stepAdd(): void {
    this.router.navigateByUrl('profil/dodajkrok/' + this.recipe.id);
  }

  stepsAdd(): void {
    this.router.navigateByUrl('profil/dodajkroki/' + this.recipe.id);
  }


  recipeStepEdit(stepId: number): void {
    this.router.navigateByUrl('profil/mojeprzepisy/edytuj/kroki/' + stepId + '/przepis/' + this.recipe.id);
  }
  recipeStepsEdit(): void {
    this.router.navigateByUrl('profil/edytujkroki/' + this.recipe.id);
  }

  recipeStepDelete(stepId: number): void {
    // tslint:disable-next-line: deprecation
    this.stepService.deleteStep(stepId).subscribe(
      response => {
        console.log(response);
        this.reloadPage();
      },
      error => {
        console.log(error);
      });
  }

  recipeIngredientUpdate(ingredientAmountId: number): void {
    this.router.navigateByUrl('profil/mojeprzepisy/edytuj/skladnik/' + ingredientAmountId + '/przepis/' + this.recipe.id);
  }

  recipeIngredientDelete(ingredientAmountId: number): void {
    // tslint:disable-next-line: deprecation
    this.ingredietService.deleteIngredient(ingredientAmountId).subscribe(
      response => {
        console.log(response);
        this.reloadPage();
      },
      error => {
        console.log(error);
      });
  }

  reloadPage(): void {
    window.location.reload();
  }

  // tslint:disable-next-line: typedef
  ingredientToShoppingList() {
    this.tempArray.forEach((ing) =>
      this.addItemToShoppingList(ing)
    );
  }

  // tslint:disable-next-line: typedef
  ingredientToDiet() {
    this.tempArray.forEach((ing) =>
      this.addIngredientToDiet(ing)
    );
  }

  addItemToShoppingList(ingredientData): void {
    const listPack = {
      // tslint:disable-next-line: quotemark object-literal-key-quotes
      productName: ingredientData.ingredient.productName,
      quantity: 1,
      additionalNote: 'dodane z przepisu' + ' ' + this.recipe.name + ' ilość składnika w przepisie '
        + ingredientData.amount.amount + ingredientData.amount.unit,
      bought: false,
      // tslint:disable-next-line: quotemark object-literal-key-quotes
      author: { "user_id": this.user.id }
    };
    // tslint:disable-next-line: deprecation
    this.shoppingListService.addShoppingList(listPack).subscribe(
      (response) => {
        console.log(response);
        this.router.navigateByUrl('profil/lista-zakupow');
      },
      (error) => {
        console.log(error);
        this.router.navigateByUrl('profil/lista-zakupow');
      }
    );

  }
  addIngredientToDiet(ingredientData): void {
    const listPack = {
      // tslint:disable-next-line: object-literal-key-quotes
      user: { 'user_id': this.user.id },
      // tslint:disable-next-line: quotemark object-literal-key-quotes
      ingredient: { 'id': ingredientData.ingredient.id },
      amount: ingredientData.amount.amount,
      unit: ingredientData.amount.unit
    };
    this.dietService.addDiet(listPack).subscribe(
      (response) => {
        console.log(response);
        this.router.navigateByUrl('profil/dieta');
      },
      (error) => {
        console.log(error);
        this.router.navigateByUrl('profil/dieta');
      }
    );
  }
}
