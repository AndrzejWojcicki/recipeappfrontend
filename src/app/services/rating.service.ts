import { Rating } from './../common/rating';
import { User } from './../common/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private ratingUrl = 'https://spring-recipe-app-backend.herokuapp.com/api/recipe-ratings/';
  private crudRatingUrl = 'https://spring-recipe-app-backend.herokuapp.com/ratings';

  constructor(private httpClient: HttpClient) { }

  getRatingAuthor(ratingId: number): Observable<User> {
    const findAuthorUrl = `${this.ratingUrl}${ratingId}/user`;
    return this.httpClient.get<User>(findAuthorUrl);
  }

  getRating(ratingId: number): Observable<Rating> {
    const findAuthorUrl = `${this.ratingUrl}${ratingId}`;
    return this.httpClient.get<Rating>(findAuthorUrl);
  }

  addRate(data): Observable<object> {
    return this.httpClient.post(`${this.crudRatingUrl}`, data);
  }

  updateRate(rateId: number, data): Observable<object> {
    return this.httpClient.put(`${this.crudRatingUrl}/${rateId}`, data);
  }

  deleteRate(rateId: number): Observable<object> {
    return this.httpClient.delete(`${this.crudRatingUrl}/${rateId}`);
  }
}
