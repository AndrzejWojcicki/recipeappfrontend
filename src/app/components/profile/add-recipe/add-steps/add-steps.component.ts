import { User } from './../../../../common/user';
import { RecipeService } from 'src/app/services/recipe.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { StepsService } from 'src/app/services/steps.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export class Descriptions {
  Value: string;
  constructor(Value: string) {
    this.Value = Value;
  }
}

@Component({
  selector: 'app-add-steps',
  templateUrl: './add-steps.component.html',
  styleUrls: ['./add-steps.component.css']
})
export class AddStepsComponent implements OnInit {

  currentUser: any;
  currentUserDetails: User = new User();
  isSubmitted = false;
  isSucceded = false;
  isFailed = false;
  errorMessage = '';
  form: any = [];
  addedRecipeId: number;
  ownRecipe = false;

  descriptions: Descriptions[] = new Array();
  isForUpdate = false;
  newDescription: any = {};
  updatedDescription;

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
    for (let i = 0; i < this.descriptions.length; i++) {
      const stepPack = {
        stepNumber: i + 1,
        description: this.descriptions[i].Value,
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
  addIngredient(): void {
    this.router.navigateByUrl('profil/dodajskladnik/' + this.addedRecipeId);
  }
}
