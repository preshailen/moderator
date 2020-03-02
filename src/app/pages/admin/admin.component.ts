import { Component, OnInit } from '@angular/core';
import { DriveService } from 'app/_services/drive.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'app/_services/alert.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  configured: boolean = null;
  private modalRef: NgbModalRef;
  configForm: FormGroup;
  roles: string[] = [];

  constructor(private ds: DriveService, public modalService: NgbModal, public general: AlertService) { }

  ngOnInit() {
    this.ds.listFiles().then(x => this.sort(x)).catch(err => console.log(err));
    this.roles.push('Moderator');
    this.roles.push('Teacher');
  }
  sort(val: any) {
    if (val.files.length > 0) {
      const files: [] = val.files;
      const config = files.find(f => (f as any).name === 'config.ini');
      if (config) {
        this.configured = true;
        this.config(config);
      } else {
        this.configured = false;
      }
    } else {
      this.configured = false;
    }
  }
  setup(content: any) {
    this.configForm = new FormGroup({
      role: new FormControl('', Validators.required)
    });
    this.modalRef = this.modalService.open(content, { size: 'lg', keyboard: false, backdrop: 'static' });
    this.modalRef.result.then((result) => {}, (reason) => {});
  }
  close(reason: string) {
    this.modalRef.close();
  }
  createConfig() {
    if (!this.configForm.invalid) {
      this.ds.addConfig('config.ini', this.configForm.get('role').value);
      this.configForm = null;
      this.close('done');
    } else {
      this.general.error('Invalid Form!');
    }
  }
  config(config: any) {
    this.ds.getFile(config.id).then(
      c => {
        if (c.role === 'Moderator') {

        } else if (c.role === 'Teacher') {

        }
      }
    )
  }
}
