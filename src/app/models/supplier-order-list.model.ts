export class SupplierOrderListModel {
    $key: string;
    productDetail: ProductDetail[];
    supplierEmail: string;
    totalPrice: number;
    userEmail: string;
    orderID: string;
    userOrderID: string;
    messages: MessageModel[];
    supplierUnread: number;
    userUnread: number;
    requested: string;
    userName: string;
    userPhone: number;
    trackingNo: string;
    courierInfo: string;
    deliverAddress: string;
    timeEst: string;
    lastAddedMsgDate: string;
    addOn: number;
    constructor() {
        this.totalPrice = 0;
        this.orderID = '';
        this.userEmail = '';
        this.requested = "";
        this.userPhone = 0;
        this.messages = new Array();
        this.userName = "";
        this.productDetail = new Array();
        this.supplierEmail = "";
        this.trackingNo = "";
        this.courierInfo = "";
        this.timeEst = "";
        this.deliverAddress = "";
        this.userOrderID = "";
        this.lastAddedMsgDate = "";
        this.supplierUnread = 0;
        this.userUnread = 0;
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

export class MessageModel {

    message: string;
    timeSent: string;
    senderId: string;
    senderEmail: string;
    constructor() {
        this.message = "";
        this.timeSent = "";
        this.senderId = "";
        this.senderEmail = "";

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