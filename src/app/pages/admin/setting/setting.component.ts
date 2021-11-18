import { Component, OnInit } from '@angular/core';
import { SettingService } from '../../../services/setting.service';
import { SettingModel } from '../../../models/setting.model';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  deduct = new SettingModel();
  deduction = 0;
  settongData = {
    key: '',
    deduction: 0
  };
  constructor(
    private toasterService: ToastrService,
    private settingService: SettingService) { }

  ngOnInit() {
    this.getsetting();
  }

  getsetting() {
    this.settingService.getSettingList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(settings => {
      settings.forEach((setting) => {
        this.settongData = setting;
      })
    });
  }


  onSave() {

    this.settingService.updateSetting(this.settongData.key, this.settongData);
    this.toasterService.success('Setting Updated!');
  }
}
