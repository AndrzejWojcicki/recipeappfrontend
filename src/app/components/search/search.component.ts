import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  searchRecipes(keyword: string, filtr: any) {
    if (keyword === '') {
    } else {
      if (filtr === 'Brak') {
        this._router.navigateByUrl('/szukaj/' + keyword);
      } else if (filtr === '1') {
        this._router.navigateByUrl('/szukaj/' + keyword + '/' + filtr);
      } else if (filtr === '2') {
        this._router.navigateByUrl('/szukaj/' + keyword + '/' + filtr);
      } else if (filtr === '3') {
        this._router.navigateByUrl('/szukaj/' + keyword + '/' + filtr);
      }
    }
  }
}
