import { Component, OnInit } from '@angular/core';
import { DriveService } from 'app/_services/drive.service';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { AlertService } from 'app/_services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  configured = false;
  configForm: FormGroup;
  roles = ['Moderator', 'Teacher'];
  role = false;
  files = [];
  folders = [];
  constructor(private ds: DriveService, public general: AlertService, private router: Router) { }
  ngOnInit() {
    this.ds.getFiles().then(x => this.sort(x)).catch(err => err);
  }
  sort(val: any) {
    if (val.files.length > 0) {
      this.files = val.files;
      const config = this.files.find(f => (f as any).name === 'config.ini');
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
        this.role = true;
      } else if (i === 'Moderator') {
        this.role = false;
      }
    });
  }
  configModerator() {
    if (!this.configForm.invalid) {
      const moderators = [];
      const permissions = [];
      const folders = [];
        for (let y = 0; y < (this.configForm.get('moderators') as FormArray).length; y++) {
          moderators.push({
            name: (this.configForm.get('moderators') as FormArray).at(y).get('name').value,
            email: (this.configForm.get('moderators') as FormArray).at(y).get('email').value
          });
          folders.push(this.ds.addFolder(moderators[y].name.toString()));
        }
        const body = {
          role: this.configForm.get('role').value,
          moderators: moderators
        };
        permissions.push(this.ds.addFile('config.ini', body));
        this.role = false;
        this.configForm = null;
        this.general.load(Promise.all(folders)).then(o => {
          for (let m = 0; m < o.length; m++) {
            permissions.push(this.ds.addPermission((o[m] as any).id, moderators[m].email));
            const val = {
              batches: 0,
              feedback: [],
            };
            permissions.push(this.ds.addSubFile('data.info', val, o[m].id));
          }
        }).then(j => this.general.load(Promise.all(permissions)).then(p => this.ds.getFiles().then(x => this.sort(x)).catch(err => err)));
    } else {
      this.general.error('Invalid Form!');
    }
  }
  configTeacher() {

  }
  config(config: any) {
    this.ds.getFile(config.id).then(
      c => {
        if (c.role === 'Moderator') {
          this.role = false;
        } else if (c.role === 'Teacher') {
          this.role = true;
          for (let r = 0; r < c.moderators.length; r++) { this.folders.push(this.files.find(k => (k.mimeType === 'application/vnd.google-apps.folder') && (k.name === c.moderators[r].name))); }
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
  createBatch(val: any) {
    this.router.navigate(['create/' + val]);
  }
  viewFeedback(val: any) {
    this.router.navigate(['view/' + val]);
  }
}
