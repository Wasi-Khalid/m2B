import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import 'rxjs/add/operator/toPromise';
import { SettingModel } from '../models/setting.model';
@Injectable()
export class SettingService {

  public dbPath = '/settings';

  settingsRef: AngularFireList<SettingModel> = null;
  settingRef: AngularFireObject<SettingModel> = null;
  constructor(

    private db: AngularFireDatabase
  ) {
    this.settingsRef = db.list(this.dbPath);
  }


  createSetting(setting: SettingModel): void {
    this.settingsRef.push(setting);
  }

  getSettingList(): AngularFireList<SettingModel> {
    return this.settingsRef;
  }


  GetSetting(id: string) {
    const itemPath = `${this.dbPath}/${id}`;
    this.settingRef = this.db.object(itemPath);
    return this.settingRef;
  }
  updateSetting(key: string, value: any): void {
    this.settingsRef.update(key, value).catch(error => this.handleError(error));
  }

  deleteSetting(key: string): void {
    this.settingsRef.remove(key).catch(error => this.handleError(error));
  }
  private handleError(error) {
    console.log(error);
  }
}





