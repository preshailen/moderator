import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/_services/alert.service';
import { DriveService } from 'app/_services/drive.service';

@Component({
  selector: 'app-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.scss', '../../shared/shared.scss']
})
export class RemarksComponent implements OnInit {
  private modalRef: NgbModalRef;
  newGroup: FormGroup = null;
  title = null;
  items = [];
  id = null;
  constructor(public drive: DriveService, public alert: AlertService, private modalService: NgbModal) { }

  ngOnInit() {
    this.drive.getFiles().then(i => {
      const remarks = i.files.find(f => (f as any).name === 'remarks.json');
      if (remarks) {
        this.seed(remarks);
      } else {
        this.configureRemarks();
      }
    }).catch(err => console.log(err));
  }
  configureRemarks() {
    this.alert.load(this.drive.configureRemarks()).then(v => this.seed(v)).catch(err => console.log(err));
  }
  seed(remarks: any) {
    this.drive.getFile(remarks.id).then(o => {
      this.id = remarks.id;
      this.items = o;
    });
  }
  requestFeature(content: any) {
    this.title = 'Feature Request';
    this.addGroup(content, 'request');
  }
  generalRemark(content: any) {
    this.title = 'General Remark';
    this.addGroup(content, 'remark');
  }
  reportIssue(content: any) {
    this.title = 'Issue Report';
    this.addGroup(content, 'issue');
  }
  addGroup(content: any, type: string) {
    this.newGroup = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      description: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      type: new FormControl(type)
    });
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', keyboard: false, backdrop: 'static' });
    this.modalRef.result.then((result) => {}, (reason) => {});
  }
  close(reason: string) {
    this.modalRef.close();
    this.newGroup = null;
    this.title = null;
  }
  delete(item: any) {
    this.alert.confirmDelete('Are You Sure?').then(p => {
      this.items = this.items.filter(f => f.id !== item.id);
      this.drive.editFile(this.id, this.items).then(e => this.alert.success('Successfully Removed Item!')).catch(err => console.log(err));
    }).catch(err => err);
  }
  add() {
    if (this.newGroup.invalid) {
      this.newGroup.markAllAsTouched();
    } else {
      const data = [];
      for (let h = 0; h < this.items.length; h++) {
        data.push({
          id: h,
          title: this.items[h].title,
          description: this.items[h].description,
          type: this.items[h].type
        });
      }
      const id = this.items.length + 1;
      data.push({
        id: id,
        title: this.newGroup.get('title').value,
        description: this.newGroup.get('description').value,
        type: this.newGroup.get('type').value
      });
      this.drive.editFile(this.id, data).then(p => {
        this.items = data;
        this.alert.success('Successfully Logged ' + this.title + '!');
        this.close('');
      }).catch(err => err);
    }
  }
  get n() {
    return (this.newGroup as FormGroup).controls;
  }
}
