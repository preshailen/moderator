import { Component, OnInit } from '@angular/core';
import { DriveService } from 'app/_services/drive.service';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { AlertService } from 'app/_services/alert.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  configured = false;
  configForm: FormGroup;
  roles = ['Moderator', 'Teacher'];
  teacher = false;
  moderator = false;
  constructor(private ds: DriveService, public general: AlertService) { }
  ngOnInit() {
    this.ds.getFiles().then(x => this.sort(x)).catch(err => err);
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
        this.setup();
      }
    } else {
      this.configured = false;
      this.setup();
    }
  }
  setup() {
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
    this.configForm.get('role').setValue('Teacher');
  }
  createConfig() {
    if (!this.configForm.invalid) {
      const moderators = [];
      for (let y = 0; y < (this.configForm.get('moderators') as FormArray).length; y++) {
        moderators.push({
          name: (this.configForm.get('moderators') as FormArray).at(y).get('name').value,
          email: (this.configForm.get('moderators') as FormArray).at(y).get('email').value
        });
        this.ds.addFolder(moderators[y].name.toString()).then(
          v => {
            this.ds.addPermission((v as any).id, moderators[y].email).then(g => g);
          }
        ).catch(err => err);
      }
      const body = {
        role: this.configForm.get('role').value,
        moderators: moderators
      };
      this.ds.addFile('config.ini', body);
      this.moderator = false;
      this.teacher = false;
      this.configForm = null;
    } else {
      this.general.error('Invalid Form!');
    }
  }
  config(config: any) {
    this.ds.getFile(config.id).then(
      c => {
        if (c.role === 'Moderator') {
          this.moderator = true;
        } else if (c.role === 'Teacher') {
          this.teacher = true;
          console.log(c);
        }
      }
    );
  }
  addModerator() {
    (this.configForm.get('moderators') as FormArray).push(new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, this.customEmailValidator])
    }));
  }
  get f() {
    return this.configForm.get('moderators') as FormArray;
  }
  getVal(id: number) {
    return ((this.configForm.get('moderators') as FormArray).at(id) as FormGroup).controls;
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
