import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DriveService } from 'app/_services/drive.service';
import { AlertService } from 'app/_services/alert.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  id: string;
  files = [];
  uploadForm: FormGroup;
  constructor(private route: ActivatedRoute, private ds: DriveService, private as: AlertService) { }
  ngOnInit() {
    this.route.data.subscribe(data => this.id = data.data.id);
    this.uploadForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }
  onFileChanges($event: any) {
     this.files = $event.srcElement.files;
  }
  upload() {
    if (this.uploadForm.valid) {
      this.as.load(this.ds.addSubFolder(this.uploadForm.get('name').value, this.id)).then(
        v => {
          for (let t = 0; t < this.files.length; t++) {
            this.ds.addSubFile(this.files[t].name, this.files[t], (v as any).id);
          }
        }
      ).then(v => this.as.successThenNav('Completed!', 'admin'));
    } else {
      this.as.error('Error with form!');
    }
  }
  get h() {
    return this.uploadForm.controls;
  }
}
