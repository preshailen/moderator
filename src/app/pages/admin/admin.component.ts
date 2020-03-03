import { Component, OnInit } from '@angular/core';
import { DriveService } from 'app/_services/drive.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormArray, Form, AbstractControl, ValidationErrors } from '@angular/forms';
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
  teacher: boolean = null;
  moderator: boolean = null;

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
      role: new FormControl('', Validators.required),
      moderators: new FormArray([])
    });
    this.configForm.get('role').valueChanges.subscribe(i => {
      if (i === 'Teacher') {
        this.teacher = true;
        this.moderator = false;
      } else if (i === 'Moderator') {
        this.moderator = true;
        this.teacher = false;
      }
    });
    this.modalRef = this.modalService.open(content, { size: 'lg', keyboard: false, backdrop: 'static' });
    this.modalRef.result.then((result) => {}, (reason) => {});
  }
  close(reason: string) {
    this.modalRef.close();
  }
  createConfig() {
    if (!this.configForm.invalid) {
      // this.ds.addConfig('config.ini', this.configForm.get('role').value);
      let pass = true;
      for (let f = 0; f < (this.configForm.get('moderators') as FormArray).length; f++) {
        if (!this.ds.checkUsername((this.configForm.get('moderators') as FormArray).at(f).get('email').value)) {
          pass = false;
        }
      }
      if (pass) {
        this.moderator = false;
        this.teacher = false;
        this.configForm = null;
        this.close('done');
      } else {
        this.general.error('Invalid Form!');
      }
    } else {
      this.general.error('Invalid Form!');
    }
  }
  config(config: any) {
    this.ds.getFile(config.id).then(
      c => {
        console.log(c)
        if (c.role === 'Moderator') {

        } else if (c.role === 'Teacher') {

        }
      }
    )
  }
  addModerator() {
    (this.configForm.get('moderators') as FormArray).push(new FormGroup({
      subject: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, this.customEmailValidator])
    }));
  }
  get f() {
    return this.configForm.get('moderators') as FormArray;
  }
  get a() {
    return (this.configForm.controls.moderators as FormArray).controls;
  }
  deleteModerator(id: number) {
    (this.configForm.get('moderators') as FormArray).removeAt(id);
  }
  customEmailValidator(control: AbstractControl): ValidationErrors {
    if (!control.value) {
      return null;
    }
    return Validators.email(control);
  }
}
