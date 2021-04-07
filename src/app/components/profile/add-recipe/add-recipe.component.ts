import { RecipeService } from 'src/app/services/recipe.service';
import { Component, OnInit } from '@angular/core';
import { RecipeCategory } from 'src/app/common/recipe-Category';
import { User } from 'src/app/common/user';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { UserDetailsService } from 'src/app/services/userdetails.service';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css']
})
export class AddRecipeComponent implements OnInit {

  currentUser: any;
  isSucceded = false;
  isFailed = false;
  errorMessage = '';
  addedRecipeId: any;
  form: any = {};

  categories: RecipeCategory[] = [
    { id: 1, categoryName: 'Ciasta i Desery' },
    { id: 2, categoryName: 'Śniadania' },
    { id: 3, categoryName: 'Zupy' },
    { id: 4, categoryName: 'Drugie Dania' },
    { id: 5, categoryName: 'Kolacje' },
    { id: 6, categoryName: 'Sałatki' },
  ];
  difficulties = [
    { id: 1, name: 'łatwe' },
    { id: 2, name: 'średnie' },
    { id: 3, name: 'trudne' },
  ];

  constructor(
    private token: TokenStorageService,
    private recipeService: RecipeService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  onSubmit(): void {
    console.log(this.form);
    const recipePack = {
      name: this.form.name,
      preparationTime: this.form.preparationTime,
      difficulty: this.form.difficulty,
      // tslint:disable-next-line: quotemark object-literal-key-quotes
      author: { "user_id": this.currentUser.id },
      // tslint:disable-next-line: quotemark object-literal-key-quotes
      category: { "id": this.form.category },
      // tslint:disable-next-line: object-literal-key-quotes
      imageUrl: this.form.imageUrl
    };
    console.log(recipePack);
    this.recipeService.addRecipe(recipePack).subscribe(
      (response) => {
        console.log(response);
        this.addedRecipeId = response;
        this.isSucceded = true;
      },
      (error) => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.isFailed = true;
      }
    );
  }

}
