import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/_services/alert.service';
import { DriveService } from 'app/_services/drive.service';

@Component({
  selector: 'app-moderators',
  templateUrl: './moderators.component.html',
  styleUrls: ['./moderators.component.scss', '../../shared/shared.scss']
})
export class ModeratorsComponent implements OnInit {
  private modalRef: NgbModalRef;
  moderators: any[] = [];
  role: any;
  newModeratorGroup: FormGroup;
  files: any[] = [];
  constructor(public ds: DriveService, private modalService: NgbModal, private general: AlertService) { }

  ngOnInit() {
    this.ds.getFiles().then(x => {
      this.files = x.files;
      if (this.files.length > 0) {
        const config = this.files.find(f => (f as any).name === 'config.json');
        if (config) {
          this.ds.getFile(config.id).then(c => {
            this.role = c.role;
            this.moderators = c.moderators;
          }).catch(err => err);
        }
      }
    }).catch(err => err);
  }
  add() {
    if (this.newModeratorGroup.invalid) {
      this.newModeratorGroup.markAllAsTouched();
    } else {
      this.general.load(this.ds.addFolder(this.newModeratorGroup.get('name').value)).then(i => {
        this.general.load(this.ds.addPermission((i as any).id, this.newModeratorGroup.get('email').value)).then(o => {
          this.moderators.push({
            name: this.newModeratorGroup.get('name').value,
            email: this.newModeratorGroup.get('email').value,
            id: (i as any).id
          });
          const body = {
            role: this.role,
            moderators: this.moderators
          };
          const config = this.files.find(f => (f as any).name === 'config.json');
          this.ds.editFile(config.id, body).then(p => {
            this.general.success('Successfully Added Moderator!');
            this.close('');
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));
    }
  }
  delete(val: any) {
    this.general.confirmDelete('Are you sure?').then(c => {
      this.moderators = this.moderators.filter(o => o.id !== val);
      const body = {
        role: this.role,
        moderators: this.moderators
      };
      const config = this.files.find(f => (f as any).name === 'config.json');
      this.ds.deleteFolder(val).then(i => this.ds.editFile(config.id, body).then(p => this.general.success('Successfully Removed Moderator!')).catch(err => console.log(err))).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }
  open(content: any) {
    this.newModeratorGroup = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(2), this.existingNameValidator(this.moderators)]),
      email: new FormControl(null, [Validators.required, this.customEmailValidator, this.existingValidator(this.moderators)])
    });
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', keyboard: false, backdrop: 'static' });
    this.modalRef.result.then((result) => {}, (reason) => {});
  }
  close(reason: string) {
    this.modalRef.close();
    this.newModeratorGroup = null;
  }
  customEmailValidator(control: AbstractControl): ValidationErrors {
    if (!control.value) {
      return null;
    }
    return Validators.email(control);
  }
  existingValidator(moderators: any[]): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value) {
        if (moderators.filter(o => o.email === control.value.trim()).length > 0) {
          return { 'alreadyExists': true };
        }
      }
      return null;
    };
  }
  existingNameValidator(moderators: any[]): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value) {
        if (moderators.filter(o => o.name === control.value.trim()).length > 0) {
          return { 'nameAlreadyExists': true };
        }
      }
      return null;
    };
  }
  get n() {
    return (this.newModeratorGroup as FormGroup).controls;
  }
}
