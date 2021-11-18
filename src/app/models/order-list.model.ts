
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
export class OrderListModel {

    $key: string;
    productDetail: ProductDetail[];
    id: string;
    supplierOrderInfo: SupplierOrderInfo[];
    status: string;
    trackingNoList = [];
    deliverAddress: string;
    totalPrice: number;
    userEmail: string;

    addOn: number;
    constructor() {
        this.id = "";
        this.totalPrice = 0;
        this.userEmail = '';
        this.deliverAddress = '';
        this.status = 'Pending';
        this.productDetail = new Array();
        this.addOn = 0;
    }
}

export class SupplierOrderInfo {

    supplierOrderId: string;
    totalProductName: Product[];

    constructor() {
        this.totalProductName = new Array();
        this.supplierOrderId = '';

    }
}
export class Product {
    productName: string;

    constructor() {
        this.productName = "";
    }
}

