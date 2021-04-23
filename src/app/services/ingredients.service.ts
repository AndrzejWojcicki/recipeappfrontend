import { IngredientsForRecipe } from './../common/ingredients-for-recipe';
import { Ingredient } from './../common/ingredient';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  private baseSearchUrl = 'http://localhost:8080/api/ingredients/search/search?name=';
  private manageIngredientAmountUrl = 'http://localhost:8080/amountsOfIngredients';
  private addIngredientUrl = 'http://localhost:8080/ingredients';
  private ingredientAmountInfoUrl = 'http://localhost:8080/api/recipe-ingredients';
  constructor(private httpClient: HttpClient) { }

  searchIngredients(keyword: string): Observable<GetResponseRecipeIngredients> {
    const searchUrl = `${this.baseSearchUrl}${keyword}`;
    return this.httpClient.get<GetResponseRecipeIngredients>(searchUrl);
  }

  addIngredient(data): Observable<object> {
    return this.httpClient.post(`${this.addIngredientUrl}`, data);
  }

  getIngredientData(ingredientAmountId: number): Observable<Ingredient> {
    return this.httpClient.get<Ingredient>(`${this.ingredientAmountInfoUrl}/${ingredientAmountId}/ingredient`);
  }

  getIngredientAmountData(ingredientAmountId: number): Observable<IngredientsForRecipe> {
    return this.httpClient.get<IngredientsForRecipe>(`${this.ingredientAmountInfoUrl}/${ingredientAmountId}`);
  }

  addIngredientAmount(data): Observable<object> {
    return this.httpClient.post(`${this.manageIngredientAmountUrl}`, data);
  }

  deleteIngredient(ingredientId: number): Observable<object> {
    return this.httpClient.delete(`${this.manageIngredientAmountUrl}/${ingredientId}`);
  }

  updateIngredient(ingredientId: number, data): Observable<object> {
    return this.httpClient.put(`${this.manageIngredientAmountUrl}/${ingredientId}`, data);
  }
}

interface GetResponseRecipeIngredients {
  _embedded: {
    ingredients: Ingredient[];
  };
}
