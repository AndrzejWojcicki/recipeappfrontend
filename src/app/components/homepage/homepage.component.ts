import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/common/recipe';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  recipes: Recipe[] = [];
  exampleRecipeID = [1, 12, 8];

  constructor(
    private recipeService: RecipeService
  ) { }

  ngOnInit(): void {
    this.exampleRecipeID.forEach(item => {
      this.recipeService.getRecipe(item).subscribe((data) => {
        this.recipes.push(data);
        this.recipes.sort((a: Recipe, b: Recipe) => (a.id > b.id ? 1 : -1));
      });
    });
  }

  // tslint:disable-next-line: typedef
  isEasy(difficulty: number) {
    if (difficulty === 1) {
      return true;
    }
    return false;
  }

  // tslint:disable-next-line: typedef
  isMedium(difficulty: number) {
    if (difficulty === 2) {
      return true;
    }
    return false;
  }

  // tslint:disable-next-line: typedef
  isHard(difficulty: number) {
    if (difficulty === 3) {
      return true;
    }
    return false;
  }

}
