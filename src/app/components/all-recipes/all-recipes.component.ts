import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Rating } from 'src/app/common/rating';
import { Recipe } from 'src/app/common/recipe';
import { User } from 'src/app/common/user';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { UserDetailsService } from 'src/app/services/userdetails.service';

@Component({
  selector: 'app-all-recipes',
  templateUrl: './all-recipes.component.html',
  styleUrls: ['./all-recipes.component.css']
})
export class AllRecipesComponent implements OnInit {
  recipes: Recipe[] = [];
  // tslint:disable-next-line: no-inferrable-types
  currentCategoryId: number = 1;
  // tslint:disable-next-line: no-inferrable-types
  searchMode: boolean = false;
  // tslint:disable-next-line: no-inferrable-types
  previousCategory: number = 1;
  temp: unknown;

  // new properties for server side paging
  // tslint:disable-next-line: no-inferrable-types
  currentPage: number = 1;
  // tslint:disable-next-line: no-inferrable-types
  pageSize: number = 6;
  // tslint:disable-next-line: no-inferrable-types
  totalRecords: number = 0;

  ratings: Rating[] = new Array();
  total = 0;
  avgRating: number;
  avgRatings: { [recipeid: number]: number } = {};

  constructor(
    // tslint:disable-next-line: variable-name
    private _recipeService: RecipeService,
    // tslint:disable-next-line: variable-name
    private _activatedRoute: ActivatedRoute,
    // tslint:disable-next-line: variable-name
    private _spinnerService: NgxSpinnerService,
    // tslint:disable-next-line: variable-name
    _config: NgbPaginationConfig
  ) {
    _config.maxSize = 3;
    _config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(() => {
      this.listRecipes();
    });
  }

  onImgError(event): void {
    event.target.src = '/assets/images/noimage.png';
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

    this._recipeService
      .getAllRecipes(this.currentPage - 1, this.pageSize)
      .subscribe(this.processPaginate());
  }

  // tslint:disable-next-line: typedef
  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.listRecipes();
  }

  // tslint:disable-next-line: typedef
  processPaginate() {
    return (data) => {
      // stops the spinner
      this._spinnerService.hide();
      this.recipes = data._embedded.recipes;
      this.recipes.sort((a: Recipe, b: Recipe) => (a.id > b.id ? 1 : -1));
      // page number starts from 1 index in frontend side
      this.currentPage = data.page.number + 1;
      this.totalRecords = data.page.totalElements;
      this.pageSize = data.page.size;
      this.getRecipeRatings();
    };
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
}
