import { UserDetailsService } from './../../../../services/userdetails.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Rating } from 'src/app/common/rating';
import { Recipe } from 'src/app/common/recipe';
import { RecipeService } from 'src/app/services/recipe.service';
import { User } from 'src/app/common/user';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.css']
})
export class MyRecipesComponent implements OnInit {
  recipes: Recipe[] = [];

  ratings: Rating[] = new Array();
  total = 0;
  avgRating: number;
  avgRatings: { [recipeid: number]: number } = {};

  currentUser: any;
  user: User = new User();

  constructor(
    // tslint:disable-next-line: variable-name
    private _recipeService: RecipeService,
    // tslint:disable-next-line: variable-name
    private _activatedRoute: ActivatedRoute,
    // tslint:disable-next-line: variable-name
    private _spinnerService: NgxSpinnerService,
    private token: TokenStorageService,
    private userService: UserDetailsService
  ) { }
  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.getUserInfo();
    this.listRecipes();
  }
  // tslint:disable-next-line: typedef
  listRecipes() {
    // starts the spinner
    this._spinnerService.show();
    this.handleListRecipes();
  }

  // tslint:disable-next-line: typedef
  isEasy(difficulty: number) {
    if (difficulty === 1) {
      return true;
    }
    return false;
  }

  // tslint:disable-next-line: typedef
  isMedium(difficulty: number) {
    if (difficulty === 2) {
      return true;
    }
    return false;
  }

  // tslint:disable-next-line: typedef
  isHard(difficulty: number) {
    if (difficulty === 3) {
      return true;
    }
    return false;
  }

  // tslint:disable-next-line: typedef
  handleListRecipes() {
    this.userService.getUserRecipes(this.currentUser.id).subscribe((data) => {
      this.recipes = data;
      this.recipes.sort((a: Recipe, b: Recipe) => (a.id > b.id ? 1 : -1));
      this.getRecipeRatings();
    });
    this._spinnerService.hide();
  }


  // tslint:disable-next-line: typedef
  getRecipeRatings() {
    this.avgRatings = {};
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.recipes.length; i++) {
      this._recipeService
        .getRecipeRatings(this.recipes[i].id)
        .subscribe((data) => {
          this.ratings = data;
          // tslint:disable-next-line: prefer-for-of
          for (let j = 0; j < this.ratings.length; j++) {
            this.total += this.ratings[j].value;
          }
          this.avgRating = this.total / this.ratings.length;
          if (Number.isNaN(this.avgRating)) {
            this.avgRating = 0;
          }
          this.total = 0;
          this.avgRatings[this.recipes[i].id] = this.avgRating;
        });
    }
  }

  getUserInfo(): void {
    this.userService
      .getUserDetials(this.currentUser.username)
      .subscribe((data) => {
        this.user = data;
      });
  }


  deleteRecipe(recipeId: number): void {
    this._recipeService.deleteRecipe(recipeId).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      });
    this.reloadPage();
  }

  reloadPage(): void {
    window.location.reload();
  }
}
