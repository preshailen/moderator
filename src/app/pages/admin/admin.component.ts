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
    this.ds.listFiles().then(x => this.configure(x)).catch(err => console.log(err));
    this.roles.push('Moderator');
    this.roles.push('Teacher');
  }
  configure(val: any) {
    if (val.files.length > 0) {
      // this.configured = true;
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
    const link = {
      name: 'config.ini'
    };
    this.ds.addFile(link).then(
      v => {
        this.configForm = null;
        this.close('done');
      }
    ).catch(err => {
      this.general.error('Could not add');
      this.configForm = null;
      this.close('done');
    });
  }
}
