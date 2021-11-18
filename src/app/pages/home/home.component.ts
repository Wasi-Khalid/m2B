import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../authentication/core/auth.service';
import { CategoryService } from '../../services/category.service';
import { map } from 'rxjs/operators';
import { LoggedInAsService } from '../../authentication/logged-in-as.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../models/user.model';
import { SupplierService } from '../../services/supplier.service';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tabClick = false;
  categories: any;
  cart : any;
  // selectProduct: any;
  products: any;
  oproducts: any;
  brands: any;
  SKU = new Array();
  selectedCat : 0;
  selectedPro : any;
  OrderDetail = {
    id: '',
    productName: "",
    supplierEmail: "",
    productSKU: [],
    col1Title: "",
    col2Title: ""
  }
  checkout()
  {

    if(this.tot)
    this.router.navigate(['basic-cart/final-cart']);

  }
  selectedScat = 0;
  selectedBrand = 0;
  localStorageData: any;
  LSRole: string;
  userId: string;
  isOrder = false;
  credit: number;
  removecartitem(ci)
  {
    let tutorialsRef = this.db.list('cart');
    let amount = (this.cart[ci].qty*this.cart[ci].sku.SKU_Price);
    this.tot = this.tot -amount;
    let r = tutorialsRef.remove(this.cart[ci].key);
    this.carttot();
  }

  tot : any;
  
  carttot()
  {
    console.log("carttot");
    this.tot = 0;
    let list = this.db.list('/cart');
    let t = 0;
    list.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(cart => {
      let luid  = localStorage.getItem('login');
      this.tot = 0;
      cart.forEach((currentValue, index) => {
        if( currentValue['uid'] && currentValue['uid'] == luid)
        { 
          if(currentValue['sku'] && currentValue['qty'])
          this.tot = this.tot+ (currentValue['sku'].SKU_Price * currentValue['qty']);
        }
        });
      this.tot = t;
    });
  }
  constructor(
    private supplierService: SupplierService,
    public authService: AuthService,
    private categoryService: CategoryService,
    private loginUser: LoggedInAsService,
    private router: Router,
    private db: AngularFireDatabase
  ) {
    this.carttot()
    this.userId = localStorage.getItem('login');
    let list = this.db.list('/categories');
    list.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(categories => {
      this.categories = categories;
      console.log('categories');
      console.log(this.categories);

    });
     list = this.db.list('/cart');
    list.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(cart => {
      this.cart = cart;
      console.log('cart');
      console.log(this.cart);

    });
    //brands
    list = this.db.list('/brands');
    list.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(brands => {
      this.brands = brands;
      console.log('brands');
      console.log(this.brands);

    });
    this.cart = [] ;
    list = this.db.list('/products');
    list.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(products => {
      this.products = products;
      this.oproducts = products;
      console.log('this.products');
      this.products.forEach((currentValue, index) => {

          currentValue['attr_index'] = 0;
          currentValue['qty'] = 0;
          currentValue['price'] = 0;
          currentValue['selectedAttr'] = 0;
          this.products[index] = currentValue;
          this.oproducts[index] = currentValue;
        });

    });
    this.LSRole = localStorage.getItem("op");
    this.isOrder = localStorage.getItem("orderData") ? true : false;
  }
  selectattr1(attr, pi,sval){
    console.log(this.products[pi].attributes.length);
    this.products[pi].attributes.forEach((currentValue, index) => {
      if(currentValue['name'] == attr.name)
      {
       this.products[pi].attributes[index]['chosen'] = sval;
      }
    });
    this.products[pi].attr_index = this.products[pi].attr_index +1;
    let tot= this.products[pi].attributes.length - 1;
    if(this.products[pi].attr_index > tot)
    {
      this.products[pi].attr_index = 0;
      this.products[pi].attributes = this.oproducts[pi].attributes;
    }
    console.log("next index"+this.products[pi].attr_index);
    let next = this.products[pi].attributes[this.products[pi].attr_index];
    if(next &&  this.products[pi].attr_index != 0)
    {
      console.log("comming here");

    this.hide_next(pi);
  }
    
    this.checkvariation(pi);
    //ai = current attribute index
  }
  hide_next(pi)
  {
    
    let mlocal = [];
    let next = this.products[pi].attributes[this.products[pi].attr_index];
  this.products[pi].attributes.forEach((currentValue, index) => {
      if(currentValue['chosen'] && index < this.products[pi].attr_index )
      {
        mlocal[currentValue['name']] = currentValue['chosen'];
      }
    });
    //next hide
    next.values.forEach((currentValue, index) => {
      let temvar = mlocal;
      temvar[next.name] = currentValue.val;

      if(this.exist_variation(temvar,pi))
      {
      }
      else
      {
        console.log("|Del");
        this.products[pi].attributes[this.products[pi].attr_index].values[index] = '';
        // delete this.products[pi].attributes[this.products[pi].attr_index].values[index];
      }
    });
    //next hide


  }
  selectattr(pi,product,attr,val){
    
    product.attributes.forEach((currentValue, index) => {
      if(currentValue['name'] == attr)
      {
       product.attributes[index]['chosen'] = val;
      }
    });
    product.selectedAttr = 0;
    this.products[pi] = product;
    this.checkvariation(pi)
    
  }
  skutoattr(sku)
  {
    let ar = [];
    Object.keys(sku.attributes).forEach(function (key){
        ar[key] = sku.attributes[key];
    }); 
    return ar;
  }
  exist_variation(mlocal,pi)
  {
    let exist =  0;
    this.products[pi].productSKU.forEach((currentValue, index) => {
      let msku = [];
      if(currentValue.attributes)
      {
         msku = this.skutoattr(currentValue);
         console.log('start'); 
         if(this.comparaattr(msku, mlocal))
         {
          exist =  1;
          // this.products[pi].sku = currentValue; 
         }
      }
      
    });
    return exist;

  }
  checkvariation(pi)
{
  this.products[pi].sku = null;
  let mlocal = [];

  this.products[pi].attributes.forEach((currentValue, index) => {
      if(currentValue['chosen'])
      {
        mlocal[currentValue['name']] = currentValue['chosen'];
      }
    });


  this.products[pi].productSKU.forEach((currentValue, index) => {
      let msku = [];
      if(currentValue.attributes)
      {
         msku = this.skutoattr(currentValue);
         console.log('start'); 
         if(this.comparaattr(msku, mlocal))
         {
          this.products[pi].price = currentValue.SKU_Price; 
          this.products[pi].qty = 1;
          this.products[pi].sku = currentValue; 
         }
      }
      
    });
  
  //create from local

}
getlength(arr)
{
  let i = 0;
  for(var obj in arr)
  {
    i++;
  }
    return i;
}
addcart(p)
{
  
  let str = '';
  this.products[p].attributes.forEach((currentValue, index) => {
      if(currentValue['chosen'])
      {
        if(index == 0)
        {
          str = str+currentValue['chosen'];

        }
        else{
          str = str+' - '+currentValue['chosen'];
        }

        // mlocal[currentValue['name']] = currentValue['chosen'];
      }
    });
  str = str+':'+this.products[p].qty;
  console.log(str);

   let item = {
 'pid' : this.products[p].key,
 'product' : this.products[p],
 'qty' : this.products[p].qty,
 'attributes' : this.products[p].attributes,
 'sku' : this.products[p].sku,
 'uid' : this.userId,
 'astr' : str,
   };
   // this.cart.push(item);
   
     let r = this.db.list('/cart').push(item);
     this.products[p].price = 0;
  this.products[p].qty = 0;

     let list = this.db.list('/products');
    list.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(products => {
      this.products = products;
      this.oproducts = products;
      console.log('this.products');
      this.products.forEach((currentValue, index) => {

          currentValue['attr_index'] = 0;
          currentValue['qty'] = 0;
          currentValue['selectedAttr'] = 0;
          this.products[index] = currentValue;
          this.oproducts[index] = currentValue;
        });

    });
     this.products[p] = this.oproducts[p];
     this.products[p].qty = 0;
      delete this.products[p].sku;
      this.carttot();
     console.log(this.products[p]);

     this.products[p].attributes.forEach((currentValue, index) => {
        if(currentValue['chosen'])
        {
          this.products[p].attributes[index]['chosen'] = '';

          // mlocal[currentValue['name']] = currentValue['chosen'];
        }
      });
// this.products[p].cart = 1;

}
comparaattr(arr1,arr2)
{

  if(this.getlength(arr1) != this.getlength(arr2))
  {
    return false;
  }
  let r = true;

  console.log();
  console.log(arr2.length);
  for(var obj1 in arr1)
    {
      //inner loop
      for(var obj2 in arr2)
    {
      if(obj1 == obj2 && arr1[obj1] != arr2[obj2] && r)
      {
        r = false;

      }
    }
        
    }

  return r;
}

  ngOnInit() {
    if (this.LSRole === Role.Supplier) {
      this.router.navigate(['/supplierHome']);
    } else if (this.LSRole === Role.Courier) {
      this.router.navigate(['/courier-map']);
    } else if (this.LSRole === Role.Admin) {
      this.router.navigate(['/admin']);
    }
    console.log(this.loginUser.option);
    this.localStorageData = JSON.parse(localStorage.getItem("user"));
    this.getCategoriesList();
    this.getUserByOption();

  }

  getCategoriesList() {
    // Use snapshotChanges().map() to store the key
    this.categoryService.getCategoriesList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(categories => {
      this.categories = categories;

    });
  }


  getUserByOption() {
    this.supplierService.getUsersByOption('email', this.localStorageData.email).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      this.credit = users[0].credit;

    });

  }
}



