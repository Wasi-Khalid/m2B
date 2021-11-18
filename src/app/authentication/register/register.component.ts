import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoggedInAsService } from '../logged-in-as.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';

import { AuthService } from '../core/auth.service'

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// import { AngularFire, AuthProviders, AuthMethods } from '../../../../node_modules/angularfire2';
// import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
// import { FirebaseUserModel } from '../core/user.model';
import { UserModel } from '../../models/user.model';
import { ChatMessageModel } from '../../models/chat-message.model';
import { ChatMessageService } from '../../services/chat-message.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  option: string = '';
  show: boolean = true;
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  messageObj = new ChatMessageModel();
  user: UserModel = new UserModel();
  msgStruct = [{
    message: 'Welcome to M2B',
    timeSent: '',
    senderId: '',
    senderEmail: ''
  }];

  localStorageData: any;

  constructor(private toastrService: ToastrService, private actroute: ActivatedRoute, private activeUserService: LoggedInAsService, public authService: AuthService,
    private chatMessageSer: ChatMessageService,
    private router: Router,
    private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      phoneNo: [0, Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', Validators.required],
      cnfrmPwd: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.localStorageData = JSON.parse(localStorage.getItem("user"));

    this.option = this.actroute.snapshot.queryParamMap.get('option');
    this.option = this.option ? this.option : '';
    console.log(this.option);
  }



  courierFooter() {

    if (this.option == 'Admin') {

      this.router.navigate(['/admin']);
    } else if (this.option == 'Courier') {
      this.router.navigate(['/courier-map']);
    } else if (this.option == 'Supplier') {
      this.router.navigate(['/supplierHome']);
    } else if (this.option == 'Business') {
      this.router.navigate(['/home/products']);
    }
  }
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  tryRegister(value) {
    console.log(value.password + "  " + value.cnfrmPwd);
    this.msgStruct = [{
      message: 'Welcome to M2B', timeSent: Date.now().toString(), senderId: '', senderEmail: 'Admin@M2B.com'
    }]
    this.messageObj.messages = this.msgStruct;
    this.user.name = value.name;
    this.user.phoneNo = value.phoneNo;
    this.user.email = value.email.toLowerCase();//crossCheck
    this.user.option = this.option;
    this.user.userId = this.makeid();
    if (this.option === "Supplier" || this.option === "Business") {
      this.user.address = value.address;
    } else {
      this.user.address = "";
    }
    this.user.uid = "";
    this.user.credit = 0;
    this.user.requestApprove = this.option === "Supplier" ? "0" : "1";

    this.user.addOn = Date.now();

    if (value.password == value.cnfrmPwd) {
      this.authService.doRegister(value, this.user)
        .then(res => {
          if (this.option === "Supplier") {
            this.messageObj.lastAddedMsgDate = Date.now().toString();
            this.messageObj.userName = value.name;
            this.messageObj.userEmail = value.email.toLowerCase();
            this.messageObj.supplierUnread = 1;
            this.messageObj.userUnread = 0;
            this.messageObj.userId = "";
            this.messageObj.chatID = this.makeid();
            this.messageObj.addOn = Date.now();
            this.chatMessageSer.createchatMessage(this.messageObj);
          }

          this.courierFooter();
          console.log(res);
          this.errorMessage = "";
          this.successMessage = "Your account has been created";
          this.show = false;



        }, err => {
          console.log(err);
          this.errorMessage = err.message;
          this.successMessage = "";
        })
    } else {
      this.errorMessage = "password Not Match";
      this.successMessage = "";
    }


  }

}
