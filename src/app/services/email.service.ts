import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';

@Injectable()
export class EmailService {
  supplierTag = { title: "Thank You!", data: `User Name: ABC `, link: "" };
  emailUrl = environment.functionsURL + "/mailService";
  params: URLSearchParams = new URLSearchParams();
  constructor(private http: Http) {

  }

  async sendEmail(email: string, info: any, totalSelectPrice: number, order: any) {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });


    console.log(email);
    this.params.set('to', email);
    this.params.set('from', '"M2B Order Processing Center" <orders@m2bwholesale.com>');
    this.params.set('subject', "Order from M2b by " + email);
    if (totalSelectPrice == -2) {
      this.params.set('html', `

      <div>
      <div style="width:510px;margin:20px auto;padding:20px;background-color:#ff8e32; border-radius: 9px;">
          <div style="padding:30px 30px 0px 30px;width:450px;background-color:#fff;">
              <div style="margin-bottom:35px;">http://m2bapp.herokuapp.com/assets/img/IMG_6766.JPG
              <img src=""
                        alt="M2B Logo Not Found" style=" width: 40%; margin-left: 30%; ">
                        </div>
              <div style="font-size:14px;color:#505050;font-weight:500;">${info.title}</div>
              <p style="font-size:12px;color:#505050;margin:8px 0 25px;width:100%;line-height:18px;">${info.data}</p>
              <h5>Tracking No :</h5>${order}
              <p style="font-size:12px;color:#505050;margin-top:25px;margin-bottom:20px;">
              </p>
              
  
              <div style="border-top:1px solid #d8d8d8;padding-top:15px;padding-bottom:20px;">
                  <p style="font-size:12px;color:#505050;margin:0;">@ M2BWholesale 2019</p>
              </div>
          </div>
      </div>
    </div>
     `);
    } else {
      this.params.set('html', `

      <div>
      <div style="width:510px;margin:20px auto;padding:20px;background-color:#ff8e32; border-radius: 9px;">
          <div style="padding:30px 30px 0px 30px;width:450px;background-color:#fff;">
              <div style="margin-bottom:35px;">
              <img src="http://m2bapp.herokuapp.com/assets/img/IMG_6766.JPG"
                        alt="M2B Logo Not Found" style=" width: 40%; margin-left: 30%; ">
                        </div>
              <div style="font-size:14px;color:#505050;font-weight:500;">${info.title}</div>
              <p style="font-size:12px;color:#505050;margin:8px 0 25px;width:100%;line-height:18px;">${info.data}</p>
              ${this.getTable(order)}
              <p style="font-size:12px;color:#505050;margin-top:25px;margin-bottom:20px;">
              </p>
              <div style="padding-bottom:30px;">
  
                  <p style="font-weight:600;margin:0;">Total Amount: $ ${totalSelectPrice}</p>
                  ${info.link}
              </div>
  
              <div style="border-top:1px solid #d8d8d8;padding-top:15px;padding-bottom:20px;">
                  <p style="font-size:12px;color:#505050;margin:0;">© M2BWholesale 2019 </p>
              </div>
          </div>
      </div>
    </div>
     `);
    }

    try {
      const res = await this.http.post(this.emailUrl, this.params)
        .toPromise();
      console.log(res);
    }
    catch (err) {
      console.log(err);
    }
  }
  getTable(orderList) {
    console.log(orderList);
    let SKU = "";
    orderList.productDetail.forEach(data => {
      SKU = SKU + `
      <p style="color:#505050;width:100%;line-height:18px;font-weight: bold;font-size: initial;">Order Details: <span style="font-weight: normal;">${data.productName}</span><br></p>
            <table style="text-align: center; margin: auto; border: 1px solid #dedede; padding: .5rem; width: 33%;">
                <thead>
                    <tr>
                        <th scope="col"
                            style="background: #f2f0e6; text-align: center;  border: 1px solid #dedede; padding: 1rem; width: 33%;">
                            SKU Name</th>
                        <th scope="col"
                            style="background: #f2f0e6; text-align: center; margin: auto; border: 1px solid #dedede; padding: 1rem; width: 33%;">
                            Price</th>
                        <th scope="col"
                            style="background: #f2f0e6; text-align: center; margin: auto; border: 1px solid #dedede; padding: 1rem; width: 33%;">
                            Qt</th>
                    </tr>
                </thead>
                <tbody>
                ${this.getTableData(data)}

                </tbody>
            </table>
      `
    });

    return SKU;
  }
  getTableData(data) {
    let SKU = "";
    data.productSKU.forEach(data => {
      SKU = SKU + `
      <tr >
      <td scope="col" class="bold"
      style="text-align: center; margin: auto; border: 1px solid #dedede; padding: 1rem; width: 50%;">${data.SKU_Name}</td>
      <td scope="col" class="bold"
      style="text-align: center; margin: auto; border: 1px solid #dedede; padding: 1rem; width: 50%;">$ ${data.SKU_Price}</td>  
      <td scope="col" class="bold"
      style="text-align: center; margin: auto; border: 1px solid #dedede; padding: 1rem; width: 50%;"> ${data.quantity}</td>
  </tr>
      `
    });

    return SKU;
  }
}
