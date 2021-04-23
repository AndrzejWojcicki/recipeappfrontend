import { UserDiet } from './../common/userdiet';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ingredient } from '../common/ingredient';

@Injectable({
  providedIn: 'root',
})
export class DietsService {
  private crudDiteUrl = 'http://localhost:8080/diet';
  private dietUrl = 'http://localhost:8080/api/diet';
  private userUrl = 'http://localhost:8080/api/users';
  private findIngredientUrl = 'http://localhost:8080/dietingredient';

  constructor(private httpClient: HttpClient) { }

  addDiet(data): Observable<object> {
    return this.httpClient.post(`${this.crudDiteUrl}`, data);
  }

  updateDiet(dietId: number, data): Observable<object> {
    return this.httpClient.put(`${this.crudDiteUrl}/${dietId}`, data);
  }

  deleteDiet(dietId: number): Observable<object> {
    return this.httpClient.delete(`${this.crudDiteUrl}/${dietId}`);
  }

  getAmountIngredients(userId: number): Observable<UserDiet[]> {
    const ingredientAmountUrl = `${this.userUrl}/${userId}/diets`;
    return this.httpClient
      .get<GetResponseAmountIngredients>(ingredientAmountUrl)
      .pipe(map((response) => response._embedded.userDiet));
  }
  getAmountIngredient(userId: number): Observable<UserDiet> {
    const ingredientAmountUrl = `${this.dietUrl}/${userId}`;
    return this.httpClient.get<UserDiet>(ingredientAmountUrl);
  }

  getIngredient(ingredientId: number): Observable<Ingredient> {
    const findIngredient = `${this.dietUrl}/${ingredientId}/ingredient`;
    return this.httpClient.get<Ingredient>(findIngredient);
  }

  getDietIngredientId(idAmount: number, idIngredient: number): Observable<GetResponseDiet> {
    const ingredientURL = `${this.findIngredientUrl}/${idAmount}/${idIngredient}`;
    return this.httpClient.get<GetResponseDiet>(ingredientURL);
  }

}

// tslint:disable-next-line: no-empty-interface
interface GetResponseDiet {
  ingredient: Ingredient;
  diet: UserDiet;
}

interface GetResponseAmountIngredients {
  _embedded: {
    userDiet: UserDiet[];
  };
}
