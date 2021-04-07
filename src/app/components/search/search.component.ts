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
  searchRecipes(keyword: string) {
    if (keyword === '') {
      console.log(keyword);
      this._router.navigateByUrl('/szukaj/' + keyword + 'null');

    } else {
    console.log(keyword);
    this._router.navigateByUrl('/szukaj/' + keyword);
    }
  }
}
