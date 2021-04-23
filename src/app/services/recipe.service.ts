import { IngredientsForRecipe } from './../common/ingredients-for-recipe';
import { Comment } from 'src/app/common/comment';
import { Rating } from './../common/rating';
import { User } from './../common/user';
import { RecipeSteps } from './../common/recipe_step';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from '../common/recipe';
import { RecipeCategory } from '../common/recipe-Category';
import { Ingredient } from '../common/ingredient';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipesUrl = 'http://localhost:8080/api/recipes';
  private categoryUrl = 'http://localhost:8080/api/recipe-Category';
  private commentAuthorUrl = 'http://localhost:8080/api/recipe-comments';
  private recipeIngredientUrl = 'http://localhost:8080/api/recipe-ingredients';
  private manageRecipe = 'http://localhost:8080/recipes';
  private getIngredients = 'http://localhost:8080/recipeingredient';
  private getRecipeUrl = 'http://localhost:8080/recipe/';

  constructor(private httpClient: HttpClient) { }

  getRecipes(
    theCategoryId: number,
    currentPage: number,
    pageSize: number
  ): Observable<GetResponseRecipe> {
    const searchUrl = `${this.recipesUrl}/search/category?id=${theCategoryId}&page=${currentPage}&size=${pageSize}`;
    return this.httpClient.get<GetResponseRecipe>(searchUrl);
  }

  // tslint:disable-next-line: typedef
  private getRecipeList(searchUrl: string) {
    return this.httpClient
      .get<GetResponseRecipe>(searchUrl)
      .pipe(map((response) => response._embedded.recipes));
  }

  getAllRecipes(currentPage: number, pageSize: number): Observable<GetResponseRecipe> {
    const paginationUrl = `${this.recipesUrl}?page=${currentPage}&size=${pageSize}`;
    return this.httpClient
      .get<GetResponseRecipe>(paginationUrl);
  }

  getRecipe(id: number): Observable<Recipe> {
    const recipeUrl = `${this.getRecipeUrl}${id}`;
    return this.httpClient
      .get<Recipe>(recipeUrl);
  }

  getRecipeCategory(): Observable<RecipeCategory[]> {
    return this.httpClient
      .get<GetResponseCategory>(this.categoryUrl)
      .pipe(map((response) => response._embedded.recipeCategory));
  }

  getRecipeCategoryId(recipeId: number): Observable<RecipeCategory> {
    const categoryUrl = `${this.recipesUrl}/${recipeId}/category`;
    return this.httpClient.get<RecipeCategory>(categoryUrl);
  }

  getRecipeSteps(recipeId: number): Observable<RecipeSteps[]> {
    const stepsUrl = `${this.recipesUrl}/${recipeId}/steps`;
    return this.httpClient
      .get<GetResponseSteps>(stepsUrl)
      .pipe(map((response) => response._embedded.stepsOfRecipe));
  }

  getRecipeComments(recipeId: number): Observable<Comment[]> {
    const recipeCommentsUrl = `${this.recipesUrl}/${recipeId}/comments`;
    return this.httpClient
      .get<GetResponseComments>(recipeCommentsUrl)
      .pipe(map((response) => response._embedded.commentsOfRecipe));
  }

  getRecipeRatings(recipeId: number): Observable<Rating[]> {
    const recipeRatingsUrl = `${this.recipesUrl}/${recipeId}/ratings`;
    return this.httpClient
      .get<GetResponseRatings>(recipeRatingsUrl)
      .pipe(map((response) => response._embedded.ratingsOfRecipe));
  }

  getRecipeAuthor(recipeId: number): Observable<User> {
    const recipeRatingsUrl = `${this.recipesUrl}/${recipeId}/author`;
    return this.httpClient.get<User>(recipeRatingsUrl);
  }

  getCommentsAuthor(commentId: number): Observable<User> {
    const findCommentAuthorUrl = `${this.commentAuthorUrl}/${commentId}/author`;
    return this.httpClient.get<User>(findCommentAuthorUrl);
  }

  // tslint:disable-next-line: typedef
  // tslint:disable-next-line: adjacent-overload-signatures
  getRecipeIngredientId(idAmount: number, idIngredient: number): Observable<GetResponseIngredient> {
    const ingredientURL = `${this.getIngredients}/${idAmount}/${idIngredient}`;
    return this.httpClient.get<GetResponseIngredient>(ingredientURL);
  }

  getAmountIngredients(recipeId: number): Observable<IngredientsForRecipe[]> {
    const ingredientAmountUrl = `${this.recipesUrl}/${recipeId}/ingredients`;
    return this.httpClient
      .get<GetResponseRecipeIngredients>(ingredientAmountUrl)
      .pipe(map((response) => response._embedded.recipeIngredients));
  }

  getIngredient(ingredientId: number): Observable<Ingredient> {
    const findIngredient = `${this.recipeIngredientUrl}/${ingredientId}/ingredient`;
    return this.httpClient.get<Ingredient>(findIngredient);
  }

  searchRecipes(
    keyword: string,
    currentPage: number,
    pageSize: number
  ): Observable<GetResponseRecipe> {
    const searchUrl = `${this.recipesUrl}/search/search?name=${keyword}&page=${currentPage}&size=${pageSize}`;
    return this.httpClient.get<GetResponseRecipe>(searchUrl);
  }

  get(recipeId: number): Observable<Recipe> {
    const recipeDetailUrl = `${this.recipesUrl}/${recipeId}`;
    return this.httpClient.get<Recipe>(recipeDetailUrl);
  }

  deleteRecipe(recipeId: number): Observable<object> {
    return this.httpClient.delete(`${this.manageRecipe}/${recipeId}`);
  }

  addRecipe(data): Observable<object> {
    return this.httpClient.post(`${this.manageRecipe}`, data);
  }

  updateRecipe(recipeId: number, data): Observable<object> {
    return this.httpClient.put(`${this.manageRecipe}/${recipeId}`, data);
  }

}




interface GetResponseRecipe {
  _embedded: {
    recipes: [];
    // tslint:disable-next-line: semicolon
  };
  page: {
    // size of records in page
    size: number;
    // total number of records in database
    totalElements: number;
    // total number of pages, starts from 0 index
    totalPages: number;
    // current page
    number: number;
  };
}

interface GetResponseCategory {
  _embedded: {
    recipeCategory: RecipeCategory[];
  };
}

interface GetResponseSteps {
  _embedded: {
    stepsOfRecipe: RecipeSteps[];
  };
}

interface GetResponseComments {
  _embedded: {
    commentsOfRecipe: Comment[];
  };
}

interface GetResponseRatings {
  _embedded: {
    ratingsOfRecipe: Rating[];
  };
}

interface GetResponseRecipeIngredients {
  _embedded: {
    recipeIngredients: IngredientsForRecipe[];
  };
}

// tslint:disable-next-line: no-empty-interface
interface GetResponseIngredient {
  ingredient: Ingredient;
  amount: IngredientsForRecipe;
}
