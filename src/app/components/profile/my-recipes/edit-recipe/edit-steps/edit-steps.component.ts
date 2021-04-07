
import { RecipeService } from 'src/app/services/recipe.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { StepsService } from 'src/app/services/steps.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { User } from 'src/app/common/user';
import { RecipeSteps } from 'src/app/common/recipe_step';

export class Descriptions {
  Value: string;
  constructor(Value: string) {
    this.Value = Value;
  }
}

@Component({
  selector: 'app-edit-steps',
  templateUrl: './edit-steps.component.html',
  styleUrls: ['./edit-steps.component.css']
})
export class EditStepsComponent implements OnInit {

  currentUser: any;
  currentUserDetails: User = new User();
  steps: RecipeSteps[] = new Array();
  isSubmitted = false;
  isSucceded = false;
  isFailed = false;
  errorMessage = '';
  form: any = [];
  addedRecipeId: number;
  ownRecipe = false;
  temps: Descriptions[] = new Array();
  descriptions: Descriptions[] = new Array();
  isForUpdate = false;
  newDescription: any = {};
  updatedDescription;
  temp: Descriptions;


  constructor(
    // tslint:disable-next-line: variable-name
    private _activatedRoute: ActivatedRoute,
    private token: TokenStorageService,
    private stepsService: StepsService,
    private recipeService: RecipeService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.addedRecipeId = +this._activatedRoute.snapshot.paramMap.get('id');
    this.currentUser = this.token.getUser();
    if (this.currentUser) {
      this.checkAuthor();
      this.loadSteps();
    }
  }

  checkAuthor(): void {
    // tslint:disable-next-line: deprecation
    this.recipeService.getRecipeAuthor(this.addedRecipeId).subscribe(
      (data) => {
        if (data.user_id === this.currentUser.id) {
          this.ownRecipe = true;
        }
      }
    );
  }

  // tslint:disable-next-line: typedef
  loadSteps() {
    // tslint:disable-next-line: deprecation
    this.recipeService.getRecipeSteps(this.addedRecipeId).subscribe((data) => {
      data.sort((a: RecipeSteps, b: RecipeSteps) =>
        a.stepNumber > b.stepNumber ? 1 : -1
      );
      this.steps = data;
      for (const step of this.steps) {
        this.temp = new Descriptions('');
        this.temp.Value = step.description;
        this.temps.push(this.temp);
      }
      this.descriptions = this.temps;
    });
  }

  addDescription(): void {
    if (Object.keys(this.newDescription).length !== 0) {
      this.descriptions.push(
        this.newDescription
      );
    }
    this.newDescription = {};
  }

  deleteStep(index: number): void {
    this.descriptions.splice(index, 1);
  }

  // When user selects edit option
  editStep(id: number): void {
    this.newDescription.Value = this.descriptions[id].Value;
    this.updatedDescription = id;
    this.isForUpdate = true;
  }

  // when user clicks on update button to submit updated value
  updateStep(): void {
    const data = this.updatedDescription;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.descriptions.length; i++) {
      if (i === data) {
        if (this.newDescription.Value !== '') {
          this.descriptions[i].Value = this.newDescription.Value;
        }
      }
    }
    this.isForUpdate = false;
    this.newDescription = {};
  }

  // tslint:disable-next-line: typedef
  drop(event: CdkDragDrop<Descriptions[]>) {
    moveItemInArray(this.descriptions, event.previousIndex, event.currentIndex);
  }

  onSubmit(): void {
    console.log(this.descriptions);
    // tslint:disable-next-line: prefer-for-of
    for (const step of this.steps) {
      // tslint:disable-next-line: deprecation
      this.stepsService.deleteStep(step.id).subscribe(
        response => {
          console.log(response);
        },
        error => {
          this.isFailed = true;
          console.log(error);
        });
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.descriptions.length; i++) {
      const stepPack = {
        stepNumber: i + 1,
        description: this.descriptions[i].Value,
        // tslint:disable-next-line: quotemark object-literal-key-quotes
        recipe: { "id": this.addedRecipeId }
      };

      // tslint:disable-next-line: deprecation
      this.stepsService.addStep(stepPack).subscribe(
        (response) => {
          console.log(response);
          this.isSucceded = true;
        },
        (error) => {
          console.log(error);
          this.errorMessage = error.error.message;
          this.isFailed = true;
        }
      );
    }
    this.isSubmitted = true;

  }

  returnToRecipe(): void {
    this.router.navigateByUrl('przepisy/' + this.addedRecipeId);
  }
}

