import { ShoppingList } from './../common/shopping_list';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private listUrl = 'https://spring-recipe-app-backend.herokuapp.com/shoppingList';
  private getusersUrl = 'https://spring-recipe-app-backend.herokuapp.com/api/users/';
  private listItemURL = 'https://spring-recipe-app-backend.herokuapp.com/api/shoppingList/';

  constructor(private httpClient: HttpClient) { }

  addShoppingList(data): Observable<object> {
    return this.httpClient.post(`${this.listUrl}`, data);
  }

  updateShoppingList(shoppingListId: number, data): Observable<object> {
    return this.httpClient.put(`${this.listUrl}/${shoppingListId}`, data);
  }

  deleteShoppingList(shoppingListId: number): Observable<object> {
    return this.httpClient.delete(`${this.listUrl}/${shoppingListId}`);
  }

  getShoppingList(userId: number): Observable<GetResponseSteps> {
    const shoppingListUrl = `${this.getusersUrl}${userId}/shoppingLists`;
    return this.httpClient.get<GetResponseSteps>(shoppingListUrl);
  }
  getListItem(itemId: number): Observable<ShoppingList> {
    return this.httpClient.get<ShoppingList>(`${this.listItemURL}${itemId}`);
  }
}

interface GetResponseSteps {
  _embedded: {
    shoppingList: ShoppingList[];
  };
}

