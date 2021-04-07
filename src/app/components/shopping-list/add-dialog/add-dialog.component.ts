import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { ShoppingListService } from 'src/app/services/shoppingList.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ShoppingListComponent } from '../shopping-list.component';
@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {

  currentUser: any;
  isSucceded = false;
  isFailed = false;
  errorMessage = '';
  isValid = true;
  form: any = {};

  constructor(
    private shoppingListService: ShoppingListService,
    private token: TokenStorageService,
    public dialogRef: MatDialogRef<ShoppingListComponent>) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  onSubmit(): void {
    const regex = new RegExp(/^\d+$/);
    if (regex.test(this.form.quantity)) {
      const listPack = {
        // tslint:disable-next-line: quotemark object-literal-key-quotes
        productName: this.form.name,
        quantity: this.form.quantity,
        additionalNote: this.form.additionalinfo,
        bought: false,
        // tslint:disable-next-line: quotemark object-literal-key-quotes
        author: { "user_id": this.currentUser.id }
      };
      // tslint:disable-next-line: deprecation
      this.shoppingListService.addShoppingList(listPack).subscribe(
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
    } else {
      this.form.quantity.invalid = true;
      this.form.quantity.errors.pattern = true;
    }
  }
}
