import { RecipeSteps } from './../../../../../common/recipe_step';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { StepsService } from 'src/app/services/steps.service';

@Component({
  selector: 'app-edit-steps',
  templateUrl: './edit-step.component.html',
  styleUrls: ['./edit-step.component.css']
})
export class EditStepComponent implements OnInit {

  currentUser: any;
  addedRecipeId: number;
  stepId: number;
  ownRecipe = false;
  isSubmitted = false;
  isSucceded = false;
  isFailed = false;
  errorMessage = '';
  currentStep: RecipeSteps = new RecipeSteps();
  form: any = {};

  constructor(
    // tslint:disable-next-line: variable-name
    private _activatedRoute: ActivatedRoute,
    private token: TokenStorageService,
    private recipeService: RecipeService,
    private stepsService: StepsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.addedRecipeId = +this._activatedRoute.snapshot.paramMap.get('recipeId');
    this.stepId = + this._activatedRoute.snapshot.paramMap.get('id');
    this.currentUser = this.token.getUser();
    if (this.currentUser) {
      this.checkAuthor();
    }
    this.getStepInfo();
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

  getStepInfo(): void {
    this.stepsService.getStep(this.stepId).subscribe(
      (data) => {
        this.form.description = data.description;
        this.currentStep = data;
      }
    );
  }

  onSubmit(): void {
    const stepPack = {
      stepNumber: this.currentStep.stepNumber,
      description: this.form.description,
      // tslint:disable-next-line: quotemark object-literal-key-quotes
      recipe: { "id": this.addedRecipeId }
    };

    this.stepsService.updateStep(this.stepId, stepPack).subscribe(
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
