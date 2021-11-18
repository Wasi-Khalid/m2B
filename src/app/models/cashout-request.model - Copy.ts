

export class CashoutRequestModel {
  $key: string;
  orderDetail: OrderDetail[];
  supplierEmail: string;
  totalPrice: number;
  requestApprove: string;
  userRequestID: string;
  addOn: number;
  constructor() {
    this.totalPrice = 0;
    this.requestApprove = "";
    this.orderDetail = new Array();
    this.supplierEmail = "";
    this.userRequestID = "";
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
export class OrderDetail {
  productDetail: ProductDetail[];
  constructor() {
    this.productDetail = new Array();
  }
}

export class ProductDetail {
  productName: string;
  productSKU: SKU[];
  col1Title: string;
  col2Title: string;
  supplierEmail: string;
  constructor() {
    this.productName = "";
    this.productSKU = new Array();
    this.col1Title = "";
    this.col2Title = "";
    this.supplierEmail = "";
  }
}

