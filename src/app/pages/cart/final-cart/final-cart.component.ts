import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {ProductService} from '../../../services/product.service';
import {map} from 'rxjs/operators';
import {Router, ActivatedRoute} from '@angular/router';
import {OrderListModel, SupplierOrderInfo} from '../../../models/order-list.model';
import {OrderListService} from '../../../services/order-list.service';

import {SupplierOrderListModel} from '../../../models/supplier-order-list.model';
import {SupplierOrderListService} from '../../../services/supplier-order-list-service.service';
import {SupplierService} from '../../../services/supplier.service';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../environments/environment';

import {Http, URLSearchParams} from '@angular/http';
import {EmailService} from '../../../services/email.service';
import {Subscription} from 'rxjs';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import {v4 as uuidv4} from 'uuid';
import {any} from 'codelyzer/util/function';


declare var SqPaymentForm: any;
const idempotency_key = uuidv4();

@Component({
    selector: 'app-final-cart',
    templateUrl: './final-cart.component.html',
    styleUrls: ['./final-cart.component.css']
})
export class FinalCartComponent implements OnInit, OnDestroy, AfterViewInit {

    appUrl: string = environment.appUrl;
    checkChild = 'email';
    ownEmail: string;
    pmethod: string;
    thank: any;
    cerror: any;
    paymentForm: any;
    formLoaded = false;

    pchange() {
        if (this.pmethod === 'credit') {
            // alert(this.credit);
            if (this.credit < this.tot) {
                this.cerror = 'Your have insufecient balence!';

            }
        }

    }

    show_accor(i) {
        if (this.acord[i]) {
            this.acord[i] = 0;
        } else {
            this.acord[i] = 1;
        }
    }

    acord = new Array();
    isAddedCheck = 'isAdded';
    selectProduct: any;
    supplierOrder = new Array();
    totalQtPrice: number;
    totalSelectPrice = 0;
    deliveryAddress = '';
    supplierDetail = new SupplierOrderInfo();
    productobj = new OrderListModel();
    supplierProductobj = new SupplierOrderListModel();

    supplierProdstruct = {productName: '', productPrice: 0, quantity: 0, supplierId: '', addOn: 0};

    removecartitem(ci) {
        const tutorialsRef = this.db.list('cart');
        const amount = (this.cart[ci].qty * this.cart[ci].sku.SKU_Price);
        this.tot = this.tot - amount;
        const r = tutorialsRef.remove(this.cart[ci].key);
        this.calculateTotal();
    }

    address = {
        'fname': '',
        'lname': '',
        'email': '',
        'phone': '',
        'address': '',
        'town': '',
        'state': '',
        'postcode': '',
        'country': 'United States',

    };
    address_error = {
        'fname': '1',
        'lname': '1',
        'email': '1',
        'phone': '1',
        'address': '1',
        'town': '1',
        'state': '1',
        'postcode': '1',
        'country': '1',

    };
    saddress = {
        'fname': '',
        'lname': '',
        'email': '',
        'phone': '',
        'address': '',
        'town': '',
        'state': '',
        'postcode': '',
        'country': 'United States',

    };
    saddress_error = {
        'fname': '1',
        'lname': '1',
        'email': '1',
        'phone': '1',
        'address': '1',
        'town': '1',
        'state': '1',
        'postcode': '1',
        'country': '1',

    };
    cart: any;
    userId: any;
    sameship: any;
    save_next: any;
    shipping_methods: any;
    smethod: any;

    constructor(
        private actRoute: ActivatedRoute,
        private toastrService: ToastrService,
        private productService: ProductService,
        private router: Router,
        private orderListService: OrderListService,
        private http: Http,
        private sendEmailService: EmailService,
        private supplierOrderListService: SupplierOrderListService,
        private supplierSer: SupplierService,
        private db: AngularFireDatabase
    ) {
        this.pmethod = 'ccard';
        this.acord['acc1'] = 1;
        this.acord['acc2'] = 1;
        this.acord['acc3'] = 1;
        this.acord['acc4'] = 1;
        this.sameship = true;
        this.samount = 0;
        this.thank = 0;
        this.save_next = false;
        this.userId = localStorage.getItem('login');
        let list = this.db.list('/cart');
        list.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
            )
        ).subscribe(cart => {
            this.cart = cart;
            this.calculateTotal();

        });
        list = this.db.list('/shipping_methods');

        list.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
            )
        ).subscribe(shipping_methods => {
            this.shipping_methods = shipping_methods;
        });
        this.getUserByOption();

    }

    checkout() {
        let remain = 0;

        if (this.tot <= 0) {
            return 0;
        }
        if (this.sameship) {
            this.saddress = this.address;
        }
        //apply validation
        let error = 0;
        if (this.pmethod == 'credit') {
            // alert(this.credit);
            if (this.credit < this.tot) {
                this.cerror = 'Your have insufecient balence!';
                error = 1;
                alert(this.cerror);

            } else {
                remain = this.credit - this.tot;
            }
        }
        for (const key in this.address) {
            const value = this.address[key];
            if (!value) {
                error = 1;
                this.address_error[key] = 0;
            }
        }

        //apply validation
        if (!error) {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            const yyyy = today.getFullYear();

            const t = dd + '/' + mm + '/' + yyyy;

            const lcart = [];
            this.cart.forEach((currentValue, index) => {
                if (currentValue.uid == this.userId) {
                    lcart.push(currentValue);
                }
            });


            const order = {
                'date': t,
                'uid': this.userId,
                'tot': this.tot,
                'cart': lcart,
                'address': this.address,
                'saddress': this.saddress,
                'status': 'Pending',
            };
            if (this.save_next) {
                console.log(this.user);
                this.user.future = {
                    'address': this.address,
                    'saddress': this.saddress,
                    'save_next': this.save_next,
                    'sameship': this.sameship,
                };


                const r = this.db.list('/users').update(this.userId, this.user);
                console.log(r);
            }
            if (remain) {
                this.user.credit = remain;
                const r = this.db.list('/users').update(this.userId, this.user);
                console.log('credit update');
                console.log(r);
            }
            if (this.smethod) {
                order['shipping'] = this.shipping_methods[this.smethod];
            }
            if (this.pmethod) {
                order['pmethod'] = this.pmethod;
            }


            console.log(order);
            const r = this.db.list('/orderLists').push(order);
            if (r) {
                this.cart.forEach((currentValue, index) => {
                    if (currentValue.uid == this.userId) {
                        const tutorialsRef = this.db.list('cart');
                        const r = tutorialsRef.remove(currentValue.key);
                        lcart.push(currentValue);

                    }
                });
                this.thank = 1;
                return 0;

            }
        }
    }//checkout function end
    stot: any;
    tot: any;

    calculateTotal() {
        this.tot = 0;
        this.stot = 0;
        if (this.cart) {
            this.cart.forEach((currentValue, index) => {
                if (currentValue.uid == this.userId) {
                    console.log(currentValue.sku.SKU_Price + 'x' + currentValue.qty);
                    console.log((currentValue.sku.SKU_Price * currentValue.qty));
                    this.tot = this.tot + (currentValue.sku.SKU_Price * currentValue.qty);
                    console.log('I m here' + this.tot);
                    this.stot = this.tot;
                    this.tot = Number(this.tot) + Number(this.samount);
                }
            });
        }
        this.tot = this.tot + this.samount;
    }

    updateqty(i, type) {
        if (type == 'd') {
            if (this.cart[i].sku['SKU_Quantity'] && this.cart[i].qty) {
                if (this.cart[i].qty >= this.cart[i].sku['SKU_Quantity']) {
                    this.cart[i].qty = this.cart[i].sku['SKU_Quantity'];
                    this.toastrService.info(' Sorry stock not avalible!');
                }
            }
            return 0;
        }
        if (type == 'm') {
            this.cart[i].qty = this.cart[i].qty - 1;

        } else {
            this.cart[i].qty = this.cart[i].qty + 1;
        }

        if (this.cart[i].qty < 0) {
            this.cart[i].qty = 0;
        }
        this.calculateTotal();
    }

    orderList: any;

    ngOnInit() {
        this.orderList = JSON.parse(localStorage.getItem('orderData'));
        this.calculateTotal();
        // Set the application ID
        const applicationId = 'sandbox-sq0idb-k4hnHREFEoRrPC_7uXZV-Q';

        // Set the location ID
        const locationId = 'CBASELjav8kAOzgP4SZlbX46e_IgAQ';
        this.paymentForm = new SqPaymentForm({
            autoBuild: false,
            // Initialize the payment form elements
            applicationId: applicationId,
            locationId: locationId,
            inputClass: 'sq-input',

            // Customize the CSS for SqPaymentForm iframe elements
            inputStyles: [{
                fontSize: '.9em'
            }],


            // Initialize the credit card placeholders
            cardNumber: {
                elementId: 'sq-card-number',
                placeholder: '•••• •••• •••• ••••'
            },
            cvv: {
                elementId: 'sq-cvv',
                placeholder: 'CVV'
            },
            expirationDate: {
                elementId: 'sq-expiration-date',
                placeholder: 'MM/YY'
            },
            postalCode: {
                elementId: 'sq-postal-code'
            },

            // SqPaymentForm callback functions
            callbacks: {
                /*
                * callback function: cardNonceResponseReceived
                * Triggered when: SqPaymentForm completes a card payment token request
                */
                // tslint:disable-next-line:max-line-length
                cardNonceResponseReceived: function (errors: any, nonce: any, cardData: any, billingContact: any, shippingContact: any, shippingOption: any) {
                    if (errors) {
                        console.error('Encountered errors:');
                        errors.forEach(function (error: any) {
                            console.error('  ' + error.message);
                        });
                        alert('Encountered errors, check browser developer console for more details');
                        return;
                    }
                    fetch('process-payment', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            nonce: nonce,
                            idempotency_key: idempotency_key,
                            location_id: 'LR3D26P5J3PG7'
                        })
                    })
                        .catch(err => {
                            alert('Network error: ' + err);
                        })
                        .then(response => {
                            if (!(response ? response.ok : undefined)) {
                                return response ? response.json().then(
                                    errorInfo => Promise.reject(errorInfo)) : undefined;
                            }
                            return response ? response.json() : undefined;
                        })
                        .then(data => {
                            console.log(data);
                            alert('Payment complete successfully!\nCheck browser developer console for more details');
                        })
                        .catch(err => {
                            console.error(err);
                            alert('Payment failed to complete!\nCheck browser developer console for more details');
                        });
                }
            }
        });
        this.paymentForm.build();
    }

    requestCardNonce(event: any) {

        // Don't submit the form until SqPaymentForm returns with a nonce
        event.preventDefault();

        // Request a nonce from the SqPaymentForm object
        this.paymentForm.requestCardNonce();
    }

    ngAfterViewInit() {
    }

    loadPaymentForm() {
        if (!this.formLoaded) {
            this.paymentForm.build();
            this.formLoaded = true;
        }
    }

    samount: any;

    shipping() {
        this.samount = this.shipping_methods[this.smethod].price;
        // alert(this.samount);
        this.calculateTotal();
    }

    ngOnDestroy() {
    }

    credit: any;
    user: any;

    getUserByOption() {
        this.ownEmail = JSON.parse(localStorage.getItem('user'));
        if (this.ownEmail['email']) {
            this.supplierSer.getUsersByOption('email', this.ownEmail['email']).snapshotChanges().pipe(
                map(changes =>
                    changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
                )
            ).subscribe(users => {
                this.user = users[0];

                if (users[0]['future']) {
                    this.address = users[0]['future']['address'];
                    this.saddress = users[0]['future']['saddress'];
                    this.save_next = users[0]['future']['save_next'];
                    this.sameship = users[0]['future']['sameship'];
                }
                this.address.email = users[0].email.toString();
                this.address['phone'] = users[0].phoneNo.toString();
                this.credit = users[0].credit.toString();

            });
        }

    }

}






