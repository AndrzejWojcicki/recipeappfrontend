import { User } from './../common/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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

  constructor(private httpClient: HttpClient) { }

  getUserDetials(username: string): Observable<User> {
    const findUrl = `${this.userDataUrl}${username}`;
    return this.httpClient.get<User>(findUrl);
  }

  updateUser(userId: number, data): Observable<object> {
    return this.httpClient.put(`${this.userEditUrl}${userId}`, data);
  }

  // tslint:disable-next-line: typedef
  getUserRecipes(userId: number): Observable<Recipe[]> {
    const findRecipesUrl = `${this.userRecipesUrl}/${userId}/recipes`;
    return this.httpClient.get<GetResponseRecipe>(findRecipesUrl)
      .pipe(map((response) => response._embedded.recipes));
  }
}

interface GetResponseRecipe {
  _embedded: {
    recipes: [];
    // tslint:disable-next-line: semicolon
  };
}
