export class ProductModel {

  $key: string;
  id: string;
  product_name: string;
  product_image_url: string;
  col_name1: string;
  col_name2: string;
  color: string;
  status: string;
  path: string;
  cat_id: number;
  supplierEmail: string;
  productSKU: SKU[];
  addOn: number;
  constructor() {

    this.product_name = "";
    this.product_image_url = "";
    this.col_name1 = "";
    this.col_name2 = "";
    this.color = "";
    this.status = "";
    this.path = "";
    this.supplierEmail = "";
    this.cat_id = 0;
    this.productSKU = new Array();
    this.addOn = 0;

  }
}

export class SKU {
  SKU_Name: string;
  SKU_Price: number;
  SKU_Quantity: number;
  SKU_Cost: number;
  SKU_sold_qty: number;
  constructor() {
    this.SKU_Name = "";
    this.SKU_Price = 0;
    this.SKU_Quantity = 0;
    this.SKU_sold_qty = 0;
    this.SKU_Cost = 0;
  }
}
