import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import {AppRoutes} from './app.routes';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './authentication/auth/auth.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { HeaderComponent } from './common/layout/header/header.component';
import { OptionsComponent } from './pages/options/options.component';
import { FooterComponent } from './common/layout/footer/footer.component';
import { BasicCartComponent } from './pages/cart/basic-cart/basic-cart.component';
import { FinalCartComponent } from './pages/cart/final-cart/final-cart.component';
import { CartCheckoutComponent } from './pages/cart/cart-checkout/cart-checkout.component';
import { MaintenanceComponent } from './common/maintenance/maintenance.component';
import { Mym2bBasicComponent } from './pages/mym2b-basic/mym2b-basic.component';
import { M2bCreditComponent } from './pages/m2b-credit/m2b-credit.component';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SupplierCashoutComponent } from './pages/supplier/supplier-cashout/supplier-cashout.component';
import { SupplierCashHistoryComponent } from './pages/supplier/supplier-cash-history/supplier-cash-history.component';
import { SupplierUnderConstructionComponent } from './pages/supplier/supplier-under-construction/supplier-under-construction.component';
import { CourierMapComponent } from './pages/courier/courier-map/courier-map.component';
import { CourierOrderListComponent } from './pages/courier/courier-order-list/courier-order-list.component';
import { CourierCashOutComponent } from './pages/courier/courier-cash-out/courier-cash-out.component';
import { AgmCoreModule } from '@agm/core';
import { LoggedInAsService } from './authentication/logged-in-as.service';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { AuthService } from './authentication/core/auth.service';
import { UserService } from './authentication/core/user.service';
import { AuthGuard } from './authentication/core/auth.guard';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FormsModule } from '@angular/forms';

import { ProductsComponent } from './pages/admin/products/products.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { SideNavComponent } from './common/layout/side-nav/side-nav.component';


import { AdminComponent } from './pages/admin/admin.component';
import { SuppliersComponent } from './pages/admin/suppliers/suppliers.component';
import { ProductService } from './services/product.service';
import { EditProductComponent } from './pages/admin/products/edit-product/edit-product.component';
import { AddCategoryComponent } from './pages/admin/categories/add-category/add-category.component';
import { EditCategoryComponent } from './pages/admin/categories/edit-category/edit-category.component';
import { CategoryService } from './services/category.service';
import { AddProductComponent } from './pages/admin/products/add-product/add-product.component';
import { AdminFooterComponent } from './pages/admin/common/admin-footer/admin-footer.component';
import { SupplierService } from './services/supplier.service';
import { EditUserComponent } from './pages/admin/suppliers/edit-user/edit-user.component';
import { CategoryTabComponent } from './pages/home/category-tab/category-tab.component';
import { CatProductsComponent } from './pages/admin/products/cat-products/cat-products.component';
import { BusinessesComponent } from './pages/admin/businesses/businesses.component';
import { EditBusinessUserComponent } from './pages/admin/businesses/edit-business-user/edit-business-user.component';
import { OrderListComponent } from './pages/admin/order-list/order-list.component';
import { OrderListService } from './services/order-list.service';
import { MyOrderListComponent } from './my-order-list/my-order-list.component';
import { ChatMessageService } from './services/chat-message.service';
import {  adminChatComponent } from './pages/admin/chat/chat.component';
import { adminMessagesComponent } from './pages/admin/chat/messages/messages.component';
import { SupplierHomeComponent } from './pages/supplier/supplier-home/supplier-home.component';
import { SupplierOrderListService } from './services/supplier-order-list-service.service';

// import { HttpClient } from 'selenium-webdriver/http';
import {HttpClientModule} from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ProductDetailComponent } from './pages/home/product-detail/product-detail.component';
import { SupplierRequestComponent } from './pages/admin/supplier-request/supplier-request.component';
import { SettingComponent } from './pages/admin/setting/setting.component';
// import { PaymentService } from './services/payment.service';
import { SettingService } from './services/setting.service';
import { ChatComponent } from './pages/chat/chat.component';
import { MessagesComponent } from './pages/chat/messages/messages.component';
import { ReturnRequestComponent } from './my-order-list/return-request/return-request.component';
import { ReturnRequestService } from './services/return-request.service';
import { ReturnRequestForSupplierComponent } from './pages/admin/return-request-for-supplier/return-request-for-supplier.component';
import { ItemSoldComponent } from './pages/admin/item-sold/item-sold.component';
import { SupplierCashoutFinalComponent } from './pages/supplier/supplier-cashout-final/supplier-cashout-final.component';
import { EmailService } from './services/email.service';
import { CashoutRequestService } from './services/cashout-request.service';
import { CashoutRequestComponent } from './pages/admin/cashout-request/cashout-request.component';
import { ManageUserService } from './services/manage-user.service';


 



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AuthComponent,
    NotfoundComponent,
    HeaderComponent,
    OptionsComponent,
    FooterComponent,
    BasicCartComponent,
    FinalCartComponent,
    CartCheckoutComponent,
    MaintenanceComponent,
    Mym2bBasicComponent,
    M2bCreditComponent,
    SupplierCashoutComponent,
    SupplierCashHistoryComponent,
    SupplierUnderConstructionComponent,
    CourierMapComponent,
    CourierOrderListComponent,
    CourierCashOutComponent,
    ProductsComponent,
    CategoriesComponent,
    SideNavComponent,
   
    AdminFooterComponent,
    AdminComponent,
    SuppliersComponent,
    AddProductComponent,
    EditProductComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    EditUserComponent,
    CategoryTabComponent,
    CatProductsComponent,
    BusinessesComponent,
    EditBusinessUserComponent,
    OrderListComponent,
    MyOrderListComponent,
    adminMessagesComponent,
    adminChatComponent,
    MessagesComponent,
    SupplierHomeComponent,
    ProductDetailComponent,
    SupplierRequestComponent,
    SettingComponent,
    ChatComponent,
    ReturnRequestComponent,
    ReturnRequestForSupplierComponent,
    ItemSoldComponent,
    SupplierCashoutFinalComponent,
    CashoutRequestComponent
    

  ],
  imports: [
    BrowserModule,
    AppRoutes,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    // AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    // RouterModule.forRoot(rootRouterConfig , { useHash: false }),
    AngularFirestoreModule, 

    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBnQxUfgRItlly97RI2O2EmdTsUtwDhrD4'
    }),

    // ToastrModule.forRoot()
  ],
  providers: [ LoggedInAsService ,
        AuthService,
        UserService, 
        AuthGuard,
        ReturnRequestService,
        ProductService, 
        SettingService, 
        CategoryService, 
        SupplierService,
        OrderListService,
        ChatMessageService,
        ManageUserService,
        SupplierOrderListService,
        EmailService,
        CashoutRequestService
      ],
  bootstrap: [AppComponent]
})
export class AppModule { }
