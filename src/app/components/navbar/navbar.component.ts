import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './../../services/authentication/auth.service';
import { Component, OnInit } from '@angular/core';
import { RecipeCategory } from 'src/app/common/recipe-Category';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class CategoryListComponent implements OnInit {
  categories: RecipeCategory[];
  username: string;

  constructor(
    // tslint:disable-next-line: variable-name
    private _categoryService: RecipeService,
    private tokenStorage: TokenStorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
        const user = this.tokenStorage.getUser();
        if (user) {
          this.username = user.username;
        }
      }
    });
    this.listCategories();
  }

  // tslint:disable-next-line: typedef
  listCategories() {
    this._categoryService
      .getRecipeCategory()
      .subscribe((data) => (this.categories = data));
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.authService.isLoggedIn = false;
    window.location.reload();
  }
}
