import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { IngredientsService } from 'src/app/services/ingredients.service';

@Component({
  selector: 'app-add-ingredient-to-database',
  templateUrl: './add-ingredient-to-database.component.html',
  styleUrls: ['./add-ingredient-to-database.component.css']
})
export class AddIngredientToDatabaseComponent implements OnInit {

  currentUser: any;
  isSucceded = false;
  isFailed = false;
  errorMessage = '';
  isValid = true;
  form: any = {};

  constructor(
    private ingredientsSerivce: IngredientsService,
    private token: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  onSubmit(): void {
    const regex = new RegExp(/^\d*(\.\d)?$/);
    if (!regex.test(this.form.calories)) {
      this.form.calories.invalid = true;
      this.form.calories.errors.pattern = true;
    } else if (!regex.test(this.form.fat)) {
      this.form.fat.invalid = true;
      this.form.fat.errors.pattern = true;
    } else if (!regex.test(this.form.carbohydrates)) {
      this.form.carbohydrates.invalid = true;
      this.form.carbohydrates.errors.pattern = true;
    } else if (!regex.test(this.form.proteins)) {
      this.form.proteins.invalid = true;
      this.form.proteins.errors.pattern = true;
    } else {
      const ingredientPack = {
        productName: this.form.name,
        calories: this.form.calories,
        fat: this.form.fat,
        carbohydrates: this.form.carbohydrates,
        proteins: this.form.proteins
      };
      // tslint:disable-next-line: deprecation
      this.ingredientsSerivce.addIngredient(ingredientPack).subscribe(
        (response) => {
          console.log(response);
          this.isSucceded = true;
        },
        (error) => {
          console.log(error);
          this.isFailed = true;
          this.errorMessage = error.error.message;
        }
      );
    }
  }

  returnToRecipe(): void {
    this.router.navigateByUrl('profil/mojeprzepisy');
  }
}
