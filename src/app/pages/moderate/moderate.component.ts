import { Component, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastUiImageEditorComponent } from 'ngx-tui-image-editor';
import { DriveService } from 'app/_services/drive.service';
import { AlertService } from 'app/_services/alert.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthorizationService } from 'app/_services/auth.service';

@Component({
  selector: 'app-moderate',
  templateUrl: './moderate.component.html',
  styleUrls: ['./moderate.component.scss', '../../shared/shared.scss']
})
export class ModerateComponent implements OnInit, AfterViewInit {
  @ViewChild(ToastUiImageEditorComponent, { static: false }) editor: ToastUiImageEditorComponent;
  private modalRef: NgbModalRef;
  newModeratorGroup: FormGroup;
  files = [];
  mForm: FormGroup = null;
  options = {
    includeUI: {
      loadImage: { path: 'https://picsum.photos/200/300', name: 'Blank' },
      menu: ['text', 'draw'],
      menuBarPosition: 'bottom'
    },
    cssMaxWidth: 700,
    cssMaxHeight: 500,
    selectionStyle: { cornerSize: 20, rotatingPointOffset: 70 }
  };
	public $changed = new BehaviorSubject(false);
  constructor(public aService: AuthorizationService, private route: ActivatedRoute, private modalService: NgbModal, public dService: DriveService, public alService: AlertService) { }
  ngOnInit() {
		this.route.data.subscribe(data => {
      this.files = data.data['data'];
			console.log(this.files)
      this.mForm = new FormGroup({
        currentFileChosen: new FormControl()
      });
      this.mForm.get('currentFileChosen').valueChanges.subscribe(b => {
				this.$changed.next(false);
        this.editor.editorInstance.loadImageFromURL(this.aService.getCorsFix() + 'https://drive.google.com/uc?id=' + b.id, 'workingPic').then(y => {
          this.editor.editorInstance.resizeCanvasDimension({ width: (y.newWidth * 0.5), height: y.newHeight });
					this.editor.editorInstance.on('mousedown', (event, originPointer) => this.$changed.next(true));
        }).catch(err => console.log(err));
      });
    });
  }
  ngAfterViewInit() {
    document.getElementsByClassName('tui-image-editor-header')[0].remove();
  }
	goBack() {
		this.alService.navigate('moderator-list');
	}
  save() {
    if (!this.mForm.get('currentFileChosen').value) {
      this.alService.error('No File Chosen!');
    } else {
      this.route.url.subscribe(p => {
        const blobBin = atob(this.editor.editorInstance.toDataURL().split(',')[1]);
        const array = [];
        for (let i = 0; i < blobBin.length; i++) {
          array.push(blobBin.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(array)], {type: 'image/png'});
        const existingFile = this.mForm.get('currentFileChosen').value;
        if (!existingFile.name.includes('.annotated.png')) {
          existingFile.name = existingFile.name.replace('.png', '.annotated.png');
        }
        this.alService.load(this.dService.addFileAnnotation(existingFile.id, (blob as File), existingFile.name)).then(u => {
          const data = [];
          for (let r = 0; r < this.files.length; r++) {
            if (this.files[r].id === existingFile.id) {
              this.files[r].name = existingFile.name;
              data.push({
                id: this.files[r].id,
                name: existingFile.name
              });
            } else {
              data.push({
                id: this.files[r].id,
                name: this.files[r].name
              });
            }
          }
          this.dService.editFile((p[1] as any).path, { data }).then(j => {
						this.$changed.next(false);
						window.location.reload();
					}).catch(err => console.log(err));
        }).catch(err => console.log(err));
      });
    }
  }
  finish(content: any) {
    if (!(this.files.filter(c => c.name.includes('.annotated.png')).length > 0)) {
      this.alService.error('At least 1 file must be moderated!');
    } else {
      this.newModeratorGroup = new FormGroup({
        comments: new FormControl(null, [Validators.minLength(2)])
      });
      this.modalRef = this.modalService.open(content, { scrollable: true, ariaLabelledBy: 'modal-basic-title', size: 'xl', keyboard: false, backdrop: 'static' });
      this.modalRef.result.then((result) => {}, (reason) => {});
    }
  }
  close(reason: string) {
    this.modalRef.close();
    this.newModeratorGroup = null;
  }
  finishBatch() {
    if (this.newModeratorGroup.invalid) {
      this.newModeratorGroup.markAllAsTouched();
    } else {
      this.route.url.subscribe(p => {
        this.dService.getFileMetadata((p[1] as any).path).then(o => {
          o.name = o.name.replace('.moderate', '.feedback');
          const moderated = [];
          const unmoderated = [];
          for (let k = 0; k < this.files.length; k++) {
            if (this.files[k].name.includes('.annotated')) {
              moderated.push(this.files[k]);
            } else {
              unmoderated.push(this.files[k]);
            }
          }
          const data = {
            'moderated': moderated,
            'unmoderated': unmoderated,
            'comments': this.newModeratorGroup.get('comments').value
          };
          this.alService.load(this.dService.finishModerate(o.id, o.name, data)).then(v => {
            this.close('');
            this.alService.successThenNav('Successfully Moderated Batch!', '/moderator-list');
          });
        });
      });
    }
  }
	@HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
		if (this.$changed.getValue()) {
			return false;
		} else {
			return true;
		}
  }
  get n() {
    return (this.newModeratorGroup as FormGroup).controls;
  }
}
