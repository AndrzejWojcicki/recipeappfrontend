import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeSteps } from 'src/app/common/recipe_step';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { StepsService } from 'src/app/services/steps.service';

@Component({
  selector: 'app-add-step',
  templateUrl: './add-step.component.html',
  styleUrls: ['./add-step.component.css']
})
export class AddStepComponent implements OnInit {

  currentUser: any;
  addedRecipeId: number;
  stepId: number;
  ownRecipe = false;
  isSubmitted = false;
  isSucceded = false;
  isFailed = false;
  errorMessage = '';
  form: any = {};
  stepNumber: number;

  constructor(
    // tslint:disable-next-line: variable-name
    private _activatedRoute: ActivatedRoute,
    private token: TokenStorageService,
    private recipeService: RecipeService,
    private stepsService: StepsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.addedRecipeId = +this._activatedRoute.snapshot.paramMap.get('id');
    this.currentUser = this.token.getUser();
    if (this.currentUser) {
      this.checkAuthor();
    }
  }

  getRecipeSteps(): void {
    const id: number = +this._activatedRoute.snapshot.paramMap.get('id');
    this.recipeService.getRecipeSteps(id).subscribe((data) => {
      this.stepNumber = data.length + 1;
    });
  }

  checkAuthor(): void {
    this.recipeService.getRecipeAuthor(this.addedRecipeId).subscribe(
      (data) => {
        if (data.user_id === this.currentUser.id) {
          this.ownRecipe = true;
          this.getRecipeSteps();
        }
      }
    );
  }

  onSubmit(): void {
    const stepPack = {
      stepNumber: this.stepNumber,
      description: this.form.description,
      // tslint:disable-next-line: quotemark object-literal-key-quotes
      recipe: { "id": this.addedRecipeId }
    };

    this.stepsService.addStep(stepPack).subscribe(
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
    this.isSubmitted = true;
  }

  returnToRecipe(): void {
    this.router.navigateByUrl('przepisy/' + this.addedRecipeId);
  }

}
