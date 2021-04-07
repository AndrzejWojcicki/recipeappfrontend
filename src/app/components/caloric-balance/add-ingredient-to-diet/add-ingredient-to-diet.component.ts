import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-add-ingredient-to-diet',
  templateUrl: './add-ingredient-to-diet.component.html',
  styleUrls: ['./add-ingredient-to-diet.component.css']
})
export class AddIngredientToDietComponent implements OnInit {

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
    this.currentUser = this.token.getUser();
  }

  returnToDiet(): void {
    this.router.navigateByUrl('profil/dieta');
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
      this.router.navigateByUrl('profil/dieta/dodajprodukt/szukaj/' + searchProductName);
    }
  }
}
