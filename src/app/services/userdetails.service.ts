import { User } from './../common/user';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../common/recipe';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsService {
  private userDataUrl =
    'https://spring-recipe-app-backend.herokuapp.com/api/users/search/findByUserName?userName=';
  private userEditUrl = 'https://spring-recipe-app-backend.herokuapp.com/users/';
  private userRecipesUrl = 'https://spring-recipe-app-backend.herokuapp.com/api/users';
  private userDietUrl = 'https://spring-recipe-app-backend.herokuapp.com/users/diet';
  private resetPasswordUrl = 'https://spring-recipe-app-backend.herokuapp.com/users/reset';
  private checkPasswordTokenUrl = 'https://spring-recipe-app-backend.herokuapp.com/users/passwordToken';
  private changePasswordTokenUrl = 'https://spring-recipe-app-backend.herokuapp.com/users/password';

  constructor(private httpClient: HttpClient) { }

  getUserDetials(username: string): Observable<User> {
    const findUrl = `${this.userDataUrl}${username}`;
    return this.httpClient.get<User>(findUrl);
  }

  getUser(id: number): Observable<User> {
    const findUrl = `${this.userRecipesUrl}/${id}`;
    return this.httpClient.get<User>(findUrl);
  }

  updateUser(userId: number, data): Observable<object> {
    return this.httpClient.put(`${this.userEditUrl}${userId}`, data);
  }
  updateUserCalories(userId: number, data): Observable<object> {
    return this.httpClient.put(`${this.userDietUrl}/${userId}`, data);
  }

  // tslint:disable-next-line: typedef
  getUserRecipes(userId: number): Observable<Recipe[]> {
    const findRecipesUrl = `${this.userRecipesUrl}/${userId}/recipes`;
    return this.httpClient.get<GetResponseRecipe>(findRecipesUrl)
      .pipe(map((response) => response._embedded.recipes));
  }

  processForgotPassword(json): Observable<object> {
    return this.httpClient.put(this.resetPasswordUrl, json);
  }
  checkPasswordToken(token: string): Observable<User> {
    return this.httpClient.put<User>(this.checkPasswordTokenUrl, token);
  }
  changePassword(json): Observable<object> {
    return this.httpClient.put(this.changePasswordTokenUrl, json);
  }
}

interface GetResponseRecipe {
  _embedded: {
    recipes: [];
    // tslint:disable-next-line: semicolon
  };
}
