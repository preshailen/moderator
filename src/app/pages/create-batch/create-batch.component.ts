import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/_services/alert.service';
import { DriveService } from 'app/_services/drive.service';
import { ValidatorService } from 'app/_services/validator.service';
import { PDFJS } from './pdf/pdf';

@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.scss', '../../shared/shared.scss']
})
export class CreateBatchComponent implements OnInit {
	private modalRef: NgbModalRef;
	newBatchForm: FormGroup = null;
	batchForm: FormGroup = null;
	moderators: any[] = [];
	files: any[] = [];
  constructor(public dService: DriveService, public alService: AlertService, private modal: NgbModal, public vService: ValidatorService) { }

  ngOnInit() {
		this.initData();
  }
	onFileChanges($event: any) {
    this.files = [];
    this.files = $event.srcElement.files;
  }
	initData(): void {
		this.batchForm = new FormGroup({
      batches: new FormArray([])
    });
		this.dService.getFiles().then(x => {
			if (x.files.length) {
				const config = x.files.find(f => (f as any).name === 'config.eMod');
				if (config) {
					this.dService.getFile(config.id).then(c => {
						console.log(c)
						for (let r = 0; r < c.moderators.length; r++) {
							 this.moderators.push(x.files.find(k => (k.mimeType === 'application/vnd.google-apps.folder') && (k.name === c.moderators[r].name)));
						}
					}).catch(err => console.log(err));
					const batches_ = x.files.filter(o => (o.name as string).endsWith('.moderate'));
					batches_.forEach(element => {
						const data = element.name.split(';')
						const name = data[0];
						const moderator = data[1];
						const dueDate = data[2].substr(0, data[2].indexOf('.moderate'));
						this.batches.push(new FormGroup({
							name: new FormControl(name),
							moderator: new FormControl(moderator),
							dueDate: new FormControl(dueDate),
							id: new FormControl(element.id)
						}));
					});
				}
			}
		}).catch(err => err);
	}
	openBatch(content: any) {
		this.newBatchForm = new FormGroup({
      name: new FormControl(null, [this.vService.invalidCharacter, Validators.required, Validators.minLength(2), this.vService.existingNameValidator(this.batches)]),
			moderator: new FormControl(null, [Validators.required]),
			dueDate: new FormControl(null, [Validators.required, this.vService.noPriorDateValidator])
    });
    this.modalRef = this.modal.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', keyboard: false, backdrop: 'static' });
    this.modalRef.result.then((result) => {}, (reason) => {});
	}
	add() {
    if (this.newBatchForm.valid && this.files.length > 0) {
      const pics = [];
      for (let v = 0; v < this.files.length; v++) {
        const doc = new Promise((res, rej) => {
          PDFJS.getDocument({ url: URL.createObjectURL(this.files[v]) }).then(pdf => {
            const promises = [];
            for (let p = 1; p <= pdf.numPages; p++) {
              promises.push(pdf.getPage(p));
            }
            this.alService.load(Promise.all(promises)).then(pages => {
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
              this.alService.load(Promise.all(renders)).then(p => {
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
      this.alService.load(Promise.all(pics)).then(p => {
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
				const name = this.newBatchForm.get('name').value + ';' + this.newBatchForm.get('moderator').value.name + ';' + this.newBatchForm.get('dueDate').value;
         this.alService.load(this.dService.addFileBatch(name, files, fileNames, this.newBatchForm.get('moderator').value.id, this.newBatchForm.get('dueDate').value)).then(v => {
					this.close('');
					this.batchForm = null;
					this.initData();
					this.alService.success('Batch Created!');
				 }).catch(err => this.alService.error(err));
      }).catch(err => console.log(err));
    } else {
			if (this.files.length <= 0) {
				this.alService.error('At least 1 file is required to moderate!');
			}
			this.newBatchForm.markAllAsTouched();
    }
  }
	delete(id: number): void {
		this.alService.confirmDelete('This will delete all files in the batch!').then(b => {
			this.dService.getFile(this.batches.at(id).get('id').value).then(p => {
				this.alService.load(this.dService.deleteAll(this.batches.at(id).get('id').value, p.data)).then(f => this.batches.removeAt(id)).catch(err => err)
			})
		}).catch(err => err)
	}
	close(reason: string) {
    this.modalRef.close();
    this.newBatchForm = null;
		this.files = [];
  }
	getSize(val: number): string {
    return ((val / 1000000).toFixed(2) + ' MB');
  }
	get batches() {
    return this.batchForm.get('batches') as FormArray;
  }
	get n() {
    return (this.newBatchForm as FormGroup).controls;
  }
}
