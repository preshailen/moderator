import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/_services/alert.service';
import { DriveService } from 'app/_services/drive.service';
import { AuthorizationService } from 'app/_services/auth.service';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss', '../../shared/shared.scss']
})
export class CommentsComponent implements OnInit {
	private modalRef: NgbModalRef;
	commentForm: FormGroup = null;
	newCommentForm: FormGroup = null;
	config: any = null;
  constructor(public aService: AuthorizationService, public dService: DriveService, public alService: AlertService, private modal: NgbModal) { }

  ngOnInit() {
		this.initData();
  }
	initData(): void {
		this.commentForm = new FormGroup({
      comments: new FormArray([])
    });
		this.dService.getFiles().then(x => {
			if (x.files.length) {
				this.config = x.files.find(f => (f as any).name === this.aService.getEmail() + '.comments.eMod');
				if (this.config) {
					this.dService.getFile(this.config.id).then(l => {
						l.comments.forEach(p => {
							this.comments.push(new FormGroup ({
								comment: new FormControl(p)
							}))
						})
					}).catch(err => err);
				}
			}
		}).catch(err => err);
	}
	openBatch(content: any) {
		this.newCommentForm = new FormGroup({
      comment: new FormControl(null, [Validators.required, Validators.minLength(2)])
    });
    this.modalRef = this.modal.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', keyboard: false, backdrop: 'static' });
    this.modalRef.result.then((result) => {}, (reason) => {});
	}
	add() {
		if (this.newCommentForm.invalid) {
			this.newCommentForm.markAllAsTouched();
		} else {
			const comments = [];
			if (this.config) {
				this.comments.getRawValue().forEach(p => {
					comments.push(p.comment)
				});
				comments.push(this.newCommentForm.get('comment').value);
				this.alService.load(this.dService.editFile(this.config.id, { comments })).then(o => {
					this.close('');
					this.initData();
				}).catch(err => this.alService.error(err));
			} else {
				comments.push(this.newCommentForm.get('comment').value);
				this.alService.load(this.dService.addSyncFile(this.aService.getEmail() + '.comments.eMod', { comments })).then(o => {
					this.close('');
					this.initData();
				}).catch(err => this.alService.error(err));
			}
		}
  }
	delete(id: number): void {
		this.alService.confirmDelete('Are you sure?').then(b => {
			if (b) {
				let comments = [];
				this.comments.getRawValue().forEach(p => {
					comments.push(p.comment)
				});
				comments = comments.filter(p => p !== this.comments.at(id).get('comment').value);
				this.alService.load(this.dService.editFile(this.config.id, { comments })).then(p => {
					this.initData();
				}).catch(err => this.alService.error(err));
			}
		}).catch(err => err)
	}
	close(reason: string) {
    this.modalRef.close();
    this.newCommentForm = null;
  }
	get comments() {
    return this.commentForm.get('comments') as FormArray;
  }
	get n() {
    return (this.newCommentForm as FormGroup).controls;
  }
}
