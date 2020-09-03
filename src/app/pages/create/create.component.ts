import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DriveService } from 'app/_services/drive.service';
import { AlertService } from 'app/_services/alert.service';
import { PDFJS } from './pdf/pdf';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  id: string;
  files: any[] = [];
  uploadForm: FormGroup;
  constructor(private route: ActivatedRoute, private ds: DriveService, private as: AlertService) { }
  ngOnInit() {
    this.route.data.subscribe(data => this.id = data.data.id);
    this.uploadForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }
  onFileChanges($event: any) {
    this.files = [];
    this.files = $event.srcElement.files;
  }
  upload() {
    if (this.uploadForm.valid) {
      const pics = [];
      for (let v = 0; v < this.files.length; v++) {
        const doc = new Promise((res, rej) => {
          PDFJS.getDocument({ url: URL.createObjectURL(this.files[v]) }).then(pdf => {
            const promises = [];
            for (let p = 1; p <= pdf.numPages; p++) {
              promises.push(pdf.getPage(p));
            }
            Promise.all(promises).then(pages => {
              const renders = [];
              for (let g = 0; g < pages.length; g++) {
                const canvas = document.createElement('canvas');
                canvas.classList.add(v.toString());
                document.getElementById('holder').appendChild(canvas);
                const viewport = pages[g].getViewport(3);
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                renders.push(pages[g].render({ canvasContext: canvas.getContext('2d'), viewport: viewport }));
              }
              Promise.all(renders).then(p => {
                const canvi = document.getElementsByClassName(v.toString());
                let totalHeight = 0;
                for (let g = 0; g < canvi.length; g++) {
                  totalHeight += (canvi[g] as HTMLCanvasElement).height;
                }
                const canvas_ = document.createElement('canvas');
                const context = canvas_.getContext('2d');
                canvas_.height = totalHeight;
                canvas_.width = (canvi[0] as HTMLCanvasElement).width;
                let y = 0;
                for (let t = 0; t < canvi.length; t++) {
                  context.drawImage(canvi[t] as HTMLCanvasElement, 0, y);
                  y += (canvi[t] as HTMLCanvasElement).height;
                }
                const singles = document.getElementsByClassName(v.toString());
                for (let g = 0; g < singles.length; g++) {
                  singles[g].remove();
                }
                res(canvas_);
              }).catch(err => rej(err));
            }).catch(err => rej(err));
          }).catch(err => rej(err));
        });
        pics.push(doc);
      }
      Promise.all(pics).then(p => {
        const files = [];
        const fileNames = [];
        for (let b = 0; b < p.length; b++) {
          const blobBin = atob(p[b].toDataURL().split(',')[1]);
          const array = [];
          for (let i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
          }
          files.push(new Blob([new Uint8Array(array)], {type: 'image/png'}));
          fileNames.push(this.files[b].name.replace('.pdf', '.png'));
        }
        this.as.load(this.ds.addFileBatch(this.uploadForm.get('name').value, files, fileNames, this.id)).then(v =>
         this.as.successThenNav('Batch Created!', '/admin')
        ).catch(err => this.as.error(err));
      }).catch(err => console.log(err));
    } else {
      this.as.error('Error with form!');
    }
  }
  get h() {
    return this.uploadForm.controls;
  }
  getSize(val: number): string {
    return ((val / 1000000).toFixed(2) + ' MB');
  }
}
