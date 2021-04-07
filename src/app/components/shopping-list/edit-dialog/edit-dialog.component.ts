import { ShoppingList } from 'src/app/common/shopping_list';
import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { ShoppingListService } from 'src/app/services/shoppingList.service';
import { ShoppingListComponent } from '../shopping-list.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
  currentUser: any;
  addedShoppingList: number;
  isSucceded = false;
  isFailed = false;
  errorMessage = '';
  isValid = true;
  form: any = {};
  shoppingList: ShoppingList = new ShoppingList();

  constructor(
    private shoppingListService: ShoppingListService,
    // tslint:disable-next-line: variable-name
    private _activatedRoute: ActivatedRoute,
    private token: TokenStorageService) { }

  ngOnInit(): void {
    this.addedShoppingList = +this._activatedRoute.snapshot.paramMap.get('id');
    this.currentUser = this.token.getUser();
    this.getShoppingList();
  }

  // tslint:disable-next-line: typedef
  getShoppingList() {
    this.shoppingListService.getListItem(this.addedShoppingList).subscribe(
      (data) => {
        console.log(data);
        this.form.name = data.productName;
        this.form.quantity = data.quantity;
        this.form.additionalinfo = data.additionalNote;
      }
    );
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
      this.shoppingListService.updateShoppingList(this.addedShoppingList, listPack).subscribe(
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
