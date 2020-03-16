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
      this.ds.getFolder(this.id).then(
        i => {
          const _files = i.files;
          const file = _files.filter(v => v.name === 'data.info');
          this.ds.getFile(file[0].id).then(
            h => {
              console.log(h)
              const newBatch = h.batches + 1;
              const body = {
                'batches': newBatch,
                'feedback': h. feedback
              };
              console.log(body)
              this.ds.editFile(file[0].id, body).then(
                v => console.log(v)
              );
            }
          ).catch(n => console.log(n));
        }
      ).catch(b => this.as.errorThenNav('Folder does not exist!', 'auth'));
     /*this.as.load(this.ds.addSubFolder(this.uploadForm.get('name').value, this.id)).then(
        v => {
          for (let t = 0; t < this.files.length; t++) {
            this.as.load(this.ds.addSubFile2(this.files[t])).then(
              b => {
                this.as.load(this.ds.subFilePatch(this.files[t].name, (b as any).d, (v as any).id)).then(o => o);
              }
            );
          }
        }
      ).then(v => this.as.successThenNav('Completed!', 'admin'));*/
    } else {
      this.as.error('Error with form!');
    }
  }
  get h() {
    return this.uploadForm.controls;
  }
}
