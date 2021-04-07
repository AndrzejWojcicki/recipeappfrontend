import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-add-ingredients',
  templateUrl: './add-ingredients.component.html',
  styleUrls: ['./add-ingredients.component.css']
})
export class AddIngredientsComponent implements OnInit {

  currentUser: any;
  errorMessage = '';
  addedRecipeId: number;
  ownRecipe = false;
  searchProductName: string;
  isValid = true;

  constructor(
    // tslint:disable-next-line: variable-name
    private _activatedRoute: ActivatedRoute,
    private token: TokenStorageService,
    private recipeService: RecipeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.addedRecipeId = +this._activatedRoute.snapshot.paramMap.get('id');
    this.currentUser = this.token.getUser();
    if (this.currentUser) {
      this.checkAuthor();
    }
  }

  checkAuthor(): void {
    this.recipeService.getRecipeAuthor(this.addedRecipeId).subscribe(
      (data) => {
        if (data.user_id === this.currentUser.id) {
          this.ownRecipe = true;
        }
      }
    );
  }

  returnToRecipe(): void {
    this.router.navigateByUrl('przepisy/' + this.addedRecipeId);
  }

  searchIngredient(searchProductName: string): void {
    if (searchProductName.length === 0) {
      this.isValid = false;
      this.errorMessage = 'Nazwa produktu jest wymagana!';
    }
    else if (searchProductName.length > 0 && searchProductName.length < 2) {
      this.errorMessage = 'Nazwa produktu musi być dłuższa niż 2 znaki!';
      this.isValid = false;
    } else {
      this.router.navigateByUrl('profil/dodajskladnik/' + this.addedRecipeId + '/szukaj/' + searchProductName);
    }
  }
}
