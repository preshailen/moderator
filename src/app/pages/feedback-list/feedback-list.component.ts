import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AlertService } from 'app/_services/alert.service';
import { AuthorizationService } from 'app/_services/auth.service';
import { DriveService } from 'app/_services/drive.service';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss', '../../shared/shared.scss']
})
export class FeedbackListComponent implements OnInit {
	batchForm: FormGroup = null;
	constructor(private dService: DriveService, public alService: AlertService, public aService: AuthorizationService) { }

  ngOnInit() {
		this.batchForm = new FormGroup({
			batches: new FormArray([])
		});
    this.dService.getFiles().then(p => {
			const feedback = p.files.filter(o => (o.name as string).endsWith('.feedback') && (o.name as string).includes(this.aService.getEmail()));
			feedback.forEach((o) => {
				const data = o.name.split(";");
				const name = data[0];
				const moderator = data[1];
				this.batches.push(new FormGroup({
					name: new FormControl(name),
					moderator: new FormControl(moderator),
					id: new FormControl(o.id),
				}));
			});
		}).catch(err => console.log(err));
  }
	view(id: number) {
		this.alService.navigate('feedback', this.batches.at(id).get('id').value);
	}
  delete(id: number) {
    this.alService.confirmDelete('Are you sure?').then(b => {
			const batchId = this.batches.at(id).get('id').value;
			this.dService.getFile(batchId).then(f => {
        const moderated: [] = f.moderated;
        const unmoderated: [] = f.unmoderated;
        const ids = [];
        for (let g = 0; g < moderated.length; g++) {
          ids.push((moderated[g] as any).id);
        }
        for (let g = 0; g < unmoderated.length; g++) {
          ids.push((unmoderated[g] as any).id);
        }
				this.alService.load(this.dService.deleteAll(batchId, ids)).then(p => {
          this.batches.removeAt(id);
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));
    }).catch(err => err);
  }
	get batches() {
    return this.batchForm.get('batches') as FormArray;
  }
}
