import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';

@Injectable()
export class ManageUserService {
  emailUrl = environment.functionsURL + "/userDelete";
  params: URLSearchParams = new URLSearchParams();
  constructor(private http: Http) {
  }

  async deletUser(email) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.params.set('email', email);
    try {
      const res = await this.http.post(this.emailUrl, this.params)
        .toPromise();
      console.log(res);
    }
    catch (err) {
      console.log(err);
    }
  }
}
