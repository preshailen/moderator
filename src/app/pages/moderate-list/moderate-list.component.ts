import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AlertService } from 'app/_services/alert.service';
import { DriveService } from 'app/_services/drive.service';
import { element } from 'protractor';

@Component({
  selector: 'app-moderate-list',
  templateUrl: './moderate-list.component.html',
  styleUrls: ['./moderate-list.component.scss', '../../shared/shared.scss']
})
export class ModerateListComponent implements OnInit {
	batchForm: FormGroup = null;
  constructor(public dService: DriveService, public alservice: AlertService) { }

  ngOnInit() {
		this.batchForm = new FormGroup({
			batches: new FormArray([])
		});
		this.dService.getFiles().then(x => {
			if (x.files.length) {
				const config = x.files.find(f => (f as any).name === 'config.eMod');
				if (config) {
					const moderates = x.files.filter(o => (o.name as string).endsWith('.moderate'));
					moderates.forEach(o => {
						const data = o.name.split(';')
						const name = data[0];
						const moderator = data[1];
						const dueDate = data[2].substr(0, data[2].indexOf('.moderate'));
						this.batches.push(new FormGroup({
							name: new FormControl(name),
							moderator: new FormControl(moderator),
							dueDate: new FormControl(dueDate),
							id: new FormControl(o.id)
						}));
					});
				}
			}
		}).catch(err => err);
  }
	moderate(id: number) {
		this.alservice.navigate('moderate', this.batches.at(id).get('id').value);
	}
	get batches() {
    return this.batchForm.get('batches') as FormArray;
  }
}
