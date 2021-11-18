import { CourierCashOutComponent } from './pages/courier/courier-cash-out/courier-cash-out.component';
import { CourierMapComponent } from './pages/courier/courier-map/courier-map.component';
import { CourierOrderListComponent } from './pages/courier/courier-order-list/courier-order-list.component';
import { SupplierCashoutComponent } from './pages/supplier/supplier-cashout/supplier-cashout.component';
import { SupplierCashHistoryComponent } from './pages/supplier/supplier-cash-history/supplier-cash-history.component';
import { SupplierUnderConstructionComponent } from './pages/supplier/supplier-under-construction/supplier-under-construction.component';
import { M2bCreditComponent } from './pages/m2b-credit/m2b-credit.component';
import { Mym2bBasicComponent } from './pages/mym2b-basic/mym2b-basic.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ModuleWithProviders, Component } from '@angular/core';
import { AuthComponent } from './authentication/auth/auth.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { OptionsComponent } from './pages/options/options.component';
import { HomeComponent } from './pages/home/home.component';
import {BasicCartComponent} from "./pages/cart/basic-cart/basic-cart.component";
import {FinalCartComponent} from "./pages/cart/final-cart/final-cart.component";
import {CartCheckoutComponent} from "./pages/cart/cart-checkout/cart-checkout.component";
import {MaintenanceComponent} from "./common/maintenance/maintenance.component";
import { AuthGuard } from './authentication/core/auth.guard';

import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { SuppliersComponent } from './pages/admin/suppliers/suppliers.component';
import { AddProductComponent } from './pages/admin/products/add-product/add-product.component';
import { EditProductComponent } from './pages/admin/products/edit-product/edit-product.component';
import { AddCategoryComponent } from './pages/admin/categories/add-category/add-category.component';
import { EditCategoryComponent } from './pages/admin/categories/edit-category/edit-category.component';
import { EditUserComponent } from './pages/admin/suppliers/edit-user/edit-user.component';
import { CategoryTabComponent } from './pages/home/category-tab/category-tab.component';
import { CatProductsComponent } from './pages/admin/products/cat-products/cat-products.component';
import { EditBusinessUserComponent } from './pages/admin/businesses/edit-business-user/edit-business-user.component';
import { BusinessesComponent } from './pages/admin/businesses/businesses.component';
import { OrderListComponent } from './pages/admin/order-list/order-list.component';
import { MyOrderListComponent } from './my-order-list/my-order-list.component';
import { adminChatComponent } from './pages/admin/chat/chat.component';
import { adminMessagesComponent } from './pages/admin/chat/messages/messages.component';
import { SupplierHomeComponent } from './pages/supplier/supplier-home/supplier-home.component';
import { UserService } from './authentication/core/user.service';
import { ProductDetailComponent } from './pages/home/product-detail/product-detail.component';
// import { Role } from './models/user.model';
import { SupplierRequestComponent } from './pages/admin/supplier-request/supplier-request.component';
import { SettingComponent } from './pages/admin/setting/setting.component';
import { ChatComponent } from './pages/chat/chat.component';
import { MessagesComponent } from './pages/chat/messages/messages.component';
import { ReturnRequestComponent } from './my-order-list/return-request/return-request.component';
import { ReturnRequestForSupplierComponent } from './pages/admin/return-request-for-supplier/return-request-for-supplier.component';
import { ItemSoldComponent } from './pages/admin/item-sold/item-sold.component';
import { SupplierCashoutFinalComponent } from './pages/supplier/supplier-cashout-final/supplier-cashout-final.component';
import { CashoutRequestComponent } from './pages/admin/cashout-request/cashout-request.component';



export const routes: Routes = [

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        component: AuthComponent,
        pathMatch: 'full',
        canActivate: [UserService]
      },
      {
        path: 'login',
        children: [
          {
            path: '',
            component: LoginComponent,
            // pathMatch: 'full',
            canActivate: [UserService] 
          },
        ]
      },
      { path: 'register', component: RegisterComponent,canActivate: [UserService]   },
      { path: 'options', component: OptionsComponent ,canActivate: [UserService]  },
    ]
  },
  
  {
            path: "home",
            component: HomeComponent ,
            canActivate: [AuthGuard] ,
            
            children: [
              {
                path: '',
                redirectTo: 'HomeComponent',
                pathMatch: 'full'
              },
              {
                path: "products",
             
                children: [
                  {
                    path: '',
                    component: CategoryTabComponent ,
                    pathMatch: 'full'
                  }
                ]
                
              }
            
            ]
          },
              {
                path: "product-detail",

                    component: ProductDetailComponent ,
                    pathMatch: 'full'

              },
          {
            path: "basic-cart",
            canActivate: [AuthGuard],
            // component: BasicCartComponent ,
            children: [
              {
                path: '',
                component: BasicCartComponent ,
                // redirectTo: 'BasicCartComponent',
                pathMatch: 'full'
              },
              {
                path: "final-cart",
             
                children: [
                  {
                    path: '',
                    component: FinalCartComponent ,
                    pathMatch: 'full'
                  },
                  {
                    path: "checkout-cart", component: CartCheckoutComponent,
                    // pathMatch: 'full'
                  }
                ]
                
              }
            
            ]
          },
          
          {
            path: 'mym2bBasic',
            component: Mym2bBasicComponent ,
            pathMatch: 'full',
            canActivate: [AuthGuard]
            
          },
          {
            path: 'myOrderList',
            canActivate: [AuthGuard],
            children: [
              {
                path: '',
                component: MyOrderListComponent ,
                pathMatch: 'full'
              },
              {
                path: "returnRequest", component: ReturnRequestComponent
              }
              
            ]
           
            
          },
          {
            path: "chat", 
            canActivate: [AuthGuard],
            children: [
            {
              path: '',
              component: ChatComponent ,
              
              pathMatch: 'full'
            },
            {
              path: "messages", component: MessagesComponent
            }
            
          ]
        },
          {
            path: 'mym2bCredit',
            component: M2bCreditComponent ,
            pathMatch: 'full',
            canActivate: [AuthGuard]
          },
          {
            path: 'supplierHome',
            component: SupplierHomeComponent ,
            pathMatch: 'full',
            canActivate: [AuthGuard]
          },
          {
            path: 'supplierUnderConstruction',
            component: SupplierUnderConstructionComponent ,
            pathMatch: 'full',
            canActivate: [AuthGuard]
          },
          {
            path: 'supplierCashHistory',
            component: SupplierCashHistoryComponent ,
            pathMatch: 'full',
            canActivate: [AuthGuard]
          },
          {
            path: 'supplierCashoutFinal',
            component: SupplierCashoutFinalComponent ,
            pathMatch: 'full',
            canActivate: [AuthGuard]
          },
          {
            path: 'supplierCashout',
            component: SupplierCashoutComponent ,
            pathMatch: 'full',
            canActivate: [AuthGuard]
          },
          {
            path: 'courier-map',
            component: CourierMapComponent ,
            pathMatch: 'full',
            canActivate: [AuthGuard]
          },
          {
            path: 'courier-order-list',
            component: CourierOrderListComponent ,
            pathMatch: 'full',
            canActivate: [AuthGuard]
          },
          {
            path: 'courier-cashout',
            component: CourierCashOutComponent ,
            pathMatch: 'full',
            canActivate: [AuthGuard]
          },
          {
            path: "admin",
            component:AdminComponent,
            canActivate: [AuthGuard],
            
            children: [
              {
                path: '',
                redirectTo: 'AdminComponent',
                pathMatch: 'full'
              },
              {
                path: "order-list",
                component: OrderListComponent ,
                pathMatch: 'full'
                
              },
              {
                path: "settings",
                component: SettingComponent ,
                pathMatch: 'full'
                
              },//
              {
                path: "suppliers-request",
                component: SupplierRequestComponent ,
                pathMatch: 'full'
                
              },
              {
                path: "suppliers-cashout-request",
                component: CashoutRequestComponent ,
                pathMatch: 'full'
                
              },
              
              {
                path: "suppliers-return-request",
                component: ReturnRequestForSupplierComponent ,
                pathMatch: 'full'
                
              },
              
                {
                  path: "items-sold", component: ItemSoldComponent
                },
              {
                path: "chat", 
                
                children: [
                {
                  path: '',
                  component: adminChatComponent ,
                  
                  pathMatch: 'full'
                },
                {
                  path: "messages", component: adminMessagesComponent
                }
                
              ]
            },
              {
                path: 'categories',
                children: [
                  {
                    path: '',
                    component: CategoriesComponent ,
                    
                    pathMatch: 'full'
                  },
                  {
                    path: "edit-category", component: EditCategoryComponent
                  },
                  {
                    path: "add-category", component: AddCategoryComponent
                  },
                  
                  {
                    path: "products", 
                    
                    children: [
                    {
                      path: '',
                      component: ProductsComponent ,
                      
                      pathMatch: 'full'
                    },
                    {
                      path: "edit-product", component: EditProductComponent
                    },
                    {
                      path: "add-product", component: AddProductComponent
                    },
                    {
                      path: "cat-product", component: CatProductsComponent
                    }
                  ]},


                  {
                    path: "suppliers",

                    children: [
                      {
                        path: '',
                        component: SuppliersComponent ,
                        pathMatch: 'full'
                      },
                      {
                        path: "edit-supplier", component: EditUserComponent
                      }
                    ]
                  },
                  {
                    path: "businesses",
                    children: [
                      {
                        path: '',
                        component: BusinessesComponent ,
                        pathMatch: 'full'
                      },
                      {
                        path: "edit-businesses", component: EditBusinessUserComponent
                      }
                    ]
                  },
                  
                    // {
                    //   path: "edit-product", component: EditProductComponent
                    // },
                    // {
                    //   path: "add-product", component: AddProductComponent
                    // }
                ]
              },
            ]
          },
  {
    path: 'maintenance',
    component: MaintenanceComponent,
    canActivate: [AuthGuard]
  },
  
  
  {
    path: '**',
    component: NotfoundComponent,
    canActivate: [AuthGuard]
  }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
