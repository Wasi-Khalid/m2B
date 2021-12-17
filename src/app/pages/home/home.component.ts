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
import { ToastrService } from 'ngx-toastr';
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
  qtychange(p)
  {
    let qty = p['qty'];
    if(this.products[p].qty < 0)
    {
      this.products[p].qty = 0;
    }
    if(this.products[p].sku['SKU_Quantity'] && this.products[p].qty)
    {
      if(this.products[p].qty >= this.products[p].sku['SKU_Quantity'])
      {
        this.products[p].qty = this.products[p].sku['SKU_Quantity'];
        this.toastrService.info(' Sorry stock not avalible!');
      }
    }
    console.log(this.products[p].sku['SKU_Quantity']);
    console.log(this.products[p].qty);

  }
  select_scat(key)
  {
    this.selectedScat = key;
    
    setTimeout(()=>{                           //<<<---using ()=> syntax
       
      // alert();
 }, 1000);
                        
    
    // alsert(key);
  }
  getcolor(ci){
    let c = this.color[this.ccurcolor];
this.ccurcolor++;
if(this.ccurcolor == 2)
{
  this.ccurcolor = 0; 
}
    return c;
  }
  scroll(el: HTMLElement) {
    // window.scrollTo(el.yPosition);
}
  ccurcolor: 0;
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
  credit: any ;
  color: {
    'red','green','blue'
  }
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
    });
  }
  constructor(
    private supplierService: SupplierService,
    public authService: AuthService,
    private categoryService: CategoryService,
    private loginUser: LoggedInAsService,
    private router: Router,
    private db: AngularFireDatabase,
    private toastrService: ToastrService,
  ) { 
     this.varImg = 0;
    this.userId = localStorage.getItem('login');
    this.selectedCat = 0;
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
          currentValue['min'] = this.set_low(index);
          currentValue['selectedAttr'] = 0;
          
          this.products[index] = currentValue;
          this.oproducts[index] = currentValue;
        });

    });
    this.LSRole = localStorage.getItem("op");
    this.carttot();
    this.isOrder = localStorage.getItem("orderData") ? true : false;
  }
  checkstock(attr, pi,sval,index, test = 0){
    // console.log(index);
    if(index)
    {
      let sku = this.checkquantity(pi,attr['name'],sval);
      if(sku)
      {
        return sku['SKU_Quantity'];
      }
      else
      {
        return 0;
      }
    }
    else
    {
      return true;
    }

  }
  deselectvar(i,pi)
  {
    this.products[pi].attributes.forEach((currentValue, index) => {
      if(index > i)
      {
        this.products[pi].attributes[index]['chosen'] = '';
        console.log(currentValue);
      }
    });
  }
  selectattr1(attr, pi,sval){
    // return 0;
    let des = 0;
    this.products[pi].attributes.forEach((currentValue, index) => {
      if(currentValue['name'] == attr.name)
      {
        if(!this.products[pi].attributes[index]['chosen'])
       this.products[pi].attributes[index]['chosen'] = sval;
     else{
      des = 1;
      this.deselectvar(index,pi);
      this.products[pi].sku = null;
      this.products[pi].qty = 0;
      delete this.products[pi].attributes[index]['chosen'];
      // return 0;
     }
      }
    });
    if(!des)
    {
      let tr  = this.products[pi].attr_index +1;
      let tot= this.products[pi].attributes.length - 1;
      if(tr > tot)
      {
        this.products[pi].attr_index = 0;
        // this.products[pi].attributes = this.oproducts[pi].attributes;
      }
      else{
        this.products[pi].attr_index = this.products[pi].attr_index +1;
      }
      console.log("next index"+this.products[pi].attr_index);
      let next = this.products[pi].attributes[this.products[pi].attr_index];
      if(next &&  this.products[pi].attr_index != 0)
      {
        // console.log("comming here"); 

      this.hide_next(pi);
    }
  }
    
    this.checkvariation(pi);
    //ai = current attribute index
  }
  set_low(n)
  {
    let min = 0;
    if(this.products[n]['productSKU'])
    {
      this.products[n]['productSKU'].forEach((currentValue, index) => {
        if(index == 0)
        {
          min = currentValue['SKU_Price'];
        }
      if(currentValue['SKU_Price'] && min <= currentValue['SKU_Price']  && currentValue['SKU_Quantity'])
      {
        min = currentValue['SKU_Price'];
      }
    });
    } 
    return min;
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
      // console.log(currentValue);
      if(currentValue.val)
      {
        temvar[next.name] = currentValue.val;
      }
      else
      {
        temvar[next.name] = currentValue;
      }

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
        
        let _temp = {};
_temp[key] = sku.attributes[key];
ar.push(_temp);
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
         console.log(msku);
    console.log(mlocal);

         if(this.comparaattr(msku, mlocal,1))
         {
          exist =  1;
          // this.products[pi].sku = currentValue; 
         }
      }
      
    });
    return exist;

  }
  updateqty(index,key,qty)
  {
    console.log("cart item");
    this.cart[index].qty = qty;
    let str = '';
  this.cart[index].attributes.forEach((currentValue, index) => {
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
  str = str+':'+qty;
  this.cart[index]['astr'] = str;
    console.log(this.cart[index]);
    let r = this.db.list('/cart').update(key, this.cart[index]);

  }
  varImg: any;
  checkcart(val)
  {
    let find = 0;
    let cqty = this.products[val].qty;
    console.log("checkcart");
    this.cart.forEach((currentValue, index) => {
      if(currentValue.sku.SKU_Name == this.products[val].sku.SKU_Name && currentValue.uid == this.userId && currentValue.pid == this.products[val].key)      {
        find = 1;
        console.log(currentValue.pid+' == '+this.products[val].key);
        console.log(currentValue.sku.SKU_Name+' == '+this.products[val].sku.SKU_Name);
        console.log(currentValue.sku);
        console.log(this.products[val].sku);
        cqty = cqty + currentValue.qty;
        this.updateqty(index,currentValue.key,cqty)
      }
    });
    return find;
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

   console.log(mlocal);

  if(this.products[pi].productSKU)
  {
    this.products[pi].productSKU.forEach((currentValue, index) => {
        let msku = [];
        if(currentValue.attributes)
        {
           msku = this.skutoattr(currentValue);
           // console.log('start'); 
           // console.log(this.comparaattr(msku, mlocal)); 

           if(this.comparaattr(currentValue.attributes, mlocal))
           {
            this.products[pi].price = currentValue.SKU_Price; 
            this.products[pi].qty = 1;
            this.products[pi].sku = currentValue;
           }
        }
        
      });
  }
  
  //create from local

} checkquantity(pi,name, val)
{
   let sku = null;
  let mlocal = [];
  mlocal[name] = val;
  this.products[pi].attributes.forEach((currentValue, index) => {
      if(currentValue['chosen'])
      {
        mlocal[currentValue['name']] = currentValue['chosen'];
      }
    });
  // console.log(this.products[pi].productSKU);

  if(this.products[pi].productSKU)
  {
    this.products[pi].productSKU.forEach((currentValue, index) => {
        let msku = [];
        if(currentValue.attributes)
        {
           msku = this.skutoattr(currentValue);

           if(this.comparaattr(msku, mlocal))
           {
            // this.products[pi].price = currentValue.SKU_Price; 
            // this.products[pi].qty = 1;
            sku = currentValue;
           }
        }
        
      });
    return sku;
  }
  
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
  // console.log(str);
  // return 0;
  
  let find = this.checkcart(p);
  // console.log(find);
  // return false;
  if(!find)
  {

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
     console.log("firebase response");
     console.log(r);

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
          currentValue['min'] = this.set_low(index);
        });

    });
     this.products[p] = this.oproducts[p];
     this.products[p].qty = 0;
      delete this.products[p].sku;
      this.carttot();

     this.products[p].attributes.forEach((currentValue, index) => {
        if(currentValue['chosen'])
        {
          this.products[p].attributes[index]['chosen'] = '';

          // mlocal[currentValue['name']] = currentValue['chosen'];
        }
      });


}
else
{

     this.products[p].sku = null;

     this.products[p].attributes.forEach((currentValue, index) => {
        if(currentValue['chosen'])
        {
          delete this.products[p].attributes[index]['chosen'];

          // mlocal[currentValue['name']] = currentValue['chosen'];
        }
      });
}
}
objtokey(obj)
{
  for(var obj1 in obj)
  {
    return obj1;
    
  }
  
}
objtoval(obj)
{
  for(var obj1 in obj)
  {
    return obj[obj1];
    
  }
  
}
comparaattr(arr1,arr2,type = 0)
{

  if(this.getlength(arr1) != this.getlength(arr2))
  {
    return false;
  }
  let r = true;
  for(var obj1 in arr1)
    {
      //inner loop
      for(var obj2 in arr2)
      {
        var key = this.objtokey(arr1[obj1]);
    var val = this.objtoval(arr1[obj1]);
    if(val.val)
      val = val.val;
    
        if(key == obj2 && val != arr2[obj2] && r)
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
      if(users[0] && users[0].credit)
      this.credit = users[0].credit;
    if(!this.credit)
    {

      this.credit = '0.00';
    }

    });

  }
}



