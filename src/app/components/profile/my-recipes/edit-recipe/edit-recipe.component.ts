import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from 'src/app/common/recipe';
import { RecipeCategory } from 'src/app/common/recipe-Category';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit {

  recipe: Recipe = new Recipe();
  currentUser: any;
  isSucceded = false;
  isFailed = false;
  isSubmitted = false;
  errorMessage = '';
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

  ownRecipe = false;

  constructor(
    // tslint:disable-next-line: variable-name
    private _activatedRoute: ActivatedRoute,
    private token: TokenStorageService,
    private recipeService: RecipeService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.getRecipeInfo();
    if (this.currentUser) {
      this.checkAuthor();
    }
  }

  checkAuthor(): void {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    this.recipeService.getRecipeAuthor(id).subscribe(
      (data) => {
        if (data.user_id === this.currentUser.id) {
          this.ownRecipe = true;
        }
      }
    );
  }

  getRecipeInfo(): void {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    this.recipeService.get(id).subscribe((data) => {
      this.recipe = data;
      this.form.name = this.recipe.name;
      this.form.imageUrl = this.recipe.imageUrl;
      this.form.preparationTime = this.recipe.preparationTime;
      this.form.difficulty = this.recipe.difficulty;
    });
    this.getCategory();
  }

  getCategory(): void {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    this.recipeService.getRecipeCategoryId(id).subscribe((data) => {
      this.form.category = data.id;
    });
  }

  onSubmit(): void {
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
    this.recipeService.updateRecipe(this.recipe.id, recipePack).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
    this.isSucceded = true;
  }

  returnToRecipe(): void {
    this.router.navigateByUrl('przepisy/' + this.recipe.id);
  }
}
