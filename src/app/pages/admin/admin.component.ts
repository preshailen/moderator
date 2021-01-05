import { Component, OnInit } from '@angular/core';
import { DriveService } from 'app/_services/drive.service';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AlertService } from 'app/_services/alert.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss', '../../shared/shared.scss']
})
export class AdminComponent implements OnInit {
  private modalRef: NgbModalRef;
  configured = false;
  configForm: FormGroup;
  newModeratorForm: FormGroup;
  roles = ['Moderator', 'Teacher'];
  role = false;
  files = [];
  folders = [];
  moderates = [];
  feedbacks = [];
  constructor(private drive: DriveService, public alert: AlertService,  private modal: NgbModal, private router: Router) { }
  ngOnInit() {
    this.drive.getFiles().then(x => this.sort(x)).catch(err => err);
  }
  sort(val: any) {
    if (val.files.length) {
      this.files = (val as any).files;
      const config = this.files.find(f => (f as any).name === 'config.json');
      if (config) {
        this.configured = true;
        this.config(config);
      } else {
        this.configured = false;
        this.setup();
      }
    } else {
      this.configured = false;
      this.setup();
    }
  }
  config(config: any) {
    this.drive.getFile(config.id).then(c => {
      localStorage.setItem('configured', 'true');
      if (c.role === 'Moderator') {
        this.role = true;
        localStorage.setItem('role', 'Moderator');
        this.moderates = this.files.filter(o => (o.name as string).endsWith('.moderate'));
        this.feedbacks = this.files.filter(o => (o.name as string).endsWith('.feedback'));
      } else if (c.role === 'Teacher') {
        this.role = false;
        localStorage.setItem('role', 'Teacher');
        for (let r = 0; r < c.moderators.length; r++) { this.folders.push(this.files.find(k => (k.mimeType === 'application/vnd.google-apps.folder') && (k.name === c.moderators[r].name))); }
      }
    });
  }
  setup() {
    this.configForm = new FormGroup({
      role: new FormControl('', Validators.required),
      moderators: new FormArray([])
    });
  }
  configureModerator() {
    const body = {
      role: this.configForm.get('role').value
    };
    this.alert.load(this.drive.addSyncFile('config.json', body)).then(m => {
      this.configForm = null;
      this.configured = true;
      this.config(m);
    }).catch(err => this.alert.error(err));
  }
  configureTeacher() {
    if (this.f.length > 0) {
      const moderators = [];
      const permissions = [];
      const folders = [];
      for (let r = 0; r < this.f.length; r++) {
        folders.push(this.drive.addFolder(this.f.at(r).get('name').value));
      }
      this.alert.load(Promise.all(folders)).then(u => {
        for (let h = 0; h < u.length; h++) {
          moderators.push({
            name: this.f.at(h).get('name').value,
            email: this.f.at(h).get('email').value,
            id: (u[h] as any).id
          });
          permissions.push(this.drive.addPermission((u[h] as any).id, this.f.at(h).get('email').value));
        }
        const body = {
          role: this.configForm.get('role').value,
          moderators: moderators
        };
        permissions.push(this.drive.addSyncFile('config.json', body));
        this.alert.load(Promise.all(permissions)).then(o => {
          this.configForm = null;
          this.drive.getFiles().then(x => this.sort(x)).catch(err => err);
        });
      });
    } else {
      this.alert.error('No Moderators Have Been Added!');
    }
  }
  open(content: any) {
    this.newModeratorForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(2), this.existingNameValidator(this.f)]),
      email: new FormControl(null, [Validators.required, this.customEmailValidator, this.existingValidator(this.f)])
    });
    this.modalRef = this.modal.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', keyboard: false, backdrop: 'static' });
    this.modalRef.result.then((result) => {}, (reason) => {});
  }
  close(reason: string) {
    this.modalRef.close();
    this.newModeratorForm = null;
  }
  add() {
    if (this.newModeratorForm.invalid) {
      this.newModeratorForm.markAllAsTouched();
    } else {
      this.f.push(new FormGroup({
        name: new FormControl(this.newModeratorForm.get('name').value),
        email: new FormControl(this.newModeratorForm.get('email').value)
      }));
      this.alert.success('Added Moderator!');
      this.close('');
    }
  }
  get f() {
    return this.configForm.get('moderators') as FormArray;
  }
  get c() {
    return this.configForm.get('role') as FormControl;
  }
  get n() {
    return (this.newModeratorForm as FormGroup).controls;
  }
  customEmailValidator(control: AbstractControl): ValidationErrors {
    if (!control.value) {
      return null;
    }
    return Validators.email(control);
  }
  existingValidator(moderators: FormArray): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value) {
        if (moderators.getRawValue().filter(o => o.email === control.value.trim()).length > 0) {
          return { 'alreadyExists': true };
        }
      }
      return null;
    };
  }
  existingNameValidator(moderators: FormArray): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value) {
        if (moderators.getRawValue().filter(o => o.name === control.value.trim()).length > 0) {
          return { 'nameAlreadyExists': true };
        }
      }
      return null;
    };
  }
}
