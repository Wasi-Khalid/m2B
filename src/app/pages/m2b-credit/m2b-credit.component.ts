import { Component, OnInit, HostListener, AfterViewChecked } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';



declare let paypal: any;
@Component({
  selector: 'app-m2b-credit',
  templateUrl: './m2b-credit.component.html',
  styleUrls: ['./m2b-credit.component.css'],
})
export class M2bCreditComponent implements OnInit, AfterViewChecked {
  id: string;

  ngAfterViewChecked(): void {

  }
  checkChild = "email";
  ownEmail: string;
  credit: number;
  users: any;

  message: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cardCode: string;

  dataValue: any;
  dataDescriptor: any;
  paymentRequest: any;
  prButton: any;
  config: any;

  addScript: boolean = false;
  paypalLoad: boolean = true;

  finalAmount = 1;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private http: HttpClient,
    private supplierSer: SupplierService) {

    this.id = this.actRoute.snapshot.queryParamMap.get('productId');
    this.ownEmail = JSON.parse(localStorage.getItem("user")).email;
    this.getUsersList();
    this.finalAmount = this.supplierSer.needCredit;
  }

  ngOnInit() {

    // Multiple button for paypal payment
    paypal.Button.render({

      // Set your environment

      env: 'production', // sandbox | production

      // Specify the style of the button

      style: {
        layout: 'vertical',  // horizontal | vertical
        size: 'medium',    // medium | large | responsive
        shape: 'rect',      // pill | rect
        color: 'gold'       // gold | blue | silver | black
      },

      // Specify allowed and disallowed funding sources
      //
      // Options:
      // - paypal.FUNDING.CARD
      // - paypal.FUNDING.CREDIT
      // - paypal.FUNDING.ELV

      funding: {
        allowed: [paypal.FUNDING.CARD, paypal.FUNDING.CREDIT],
        disallowed: []
      },



      client: {
        sandbox: environment.paypalSandboxKey,
        production: environment.paypalProductionKey
      },

      payment: (data, actions) => {

        return actions.payment.create({
          payment: {
            transactions: [
              {
                amount: { total: this.finalAmount, currency: 'USD' }
              }
            ]
          }
        });
      },

      onAuthorize: (data, actions) => {
        return actions.payment.execute().then(() => {
          this.addCredit();
        });

      }

    }, '#paypal-button-container');


  }



  getUsersList() {

    this.supplierSer.getUsersByOption(this.checkChild, this.ownEmail).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      users.forEach(user => {
        this.users = user;
        console.log(this.users);
      })
    });

  }

  addCredit() {
    this.users.credit = parseInt(this.users.credit) + this.finalAmount;
    this.supplierSer.updateUser(this.users.key, this.users);
    this.finalAmount = 0;
    this.supplierSer.needCredit = 0;
    console.log('Payment Complete!');

    this.router.navigateByUrl('basic-cart/final-cart?productId=review');
    this.toastrService.success('Purchased M2B Credit Successfully!');
  }


  showToast = () => {
    if (this.users.credit == 0 || this.users.credit < 0) {
      this.toastrService.error("Not credit in M2B Account");
    } else {
      this.toastrService.info('Place Your Order');
      this.id ? this.router.navigateByUrl('basic-cart/final-cart?productId=' + this.id) : this.router.navigateByUrl('home/products');
    }

  }
}


