export class CategoryModel {

  $key: string;
  catName: string;
  status: string;
  addOn: number;
  userId: string;
  catIcon: string;

  constructor() {

    this.catName = "";
    this.status = "";
    this.addOn = 0;
    this.userId = "";
    this.catIcon = "";
  }
}
