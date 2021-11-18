export class UserModel {
  userId: string;
  name: string;
  phoneNo: number;
  email: string;
  option: string;
  address: string;
  requestApprove: string;
  uid: string;
  credit: number;
  addOn: number;

  constructor() {
    this.userId = "";
    this.name = "";
    this.phoneNo = 0;
    this.email = "";
    this.option = "";
    this.address = "";
    this.requestApprove = "";
    this.uid = "";
    this.credit = 0;
    this.addOn = 0;
  }
}

export enum Role {
  Business = '0401',
  Admin = '0101',
  Courier = '0201',
  Supplier = '0301'
}