

export class ReturnRequestModel {
  key: string;
  productDetail: ProductDetail[];
  supplierEmail: string;
  totalPrice: number;
  userEmail: string;
  requestApprove: string;
  deliverAddress: string;
  id: string;
  userOrderID: string;
  addOn: number;
  constructor() {
    this.totalPrice = 0;
    this.id = '';
    this.userEmail = '';
    this.requestApprove = "";
    this.deliverAddress = "";
    this.productDetail = new Array();
    this.supplierEmail = "";
    this.userOrderID = "";
    this.addOn = 0;
  }
}
export class SKU {
  SKU_Name: string;
  SKU_Price: number;
  SKU_Quantity: number;
  constructor() {
    this.SKU_Name = "";
    this.SKU_Price = 0;
    this.SKU_Quantity = 0;
  }
}


export class ProductDetail {
  productName: string;
  productPrice: number;
  productSKUList: SKU[];
  col1Title: string;
  col2Title: string;
  supplierEmail: string;
  constructor() {
    this.productName = "";
    this.productPrice = 0;
    this.productSKUList = new Array();
    this.col1Title = "";
    this.col2Title = "";
    this.supplierEmail = "";
  }
}

