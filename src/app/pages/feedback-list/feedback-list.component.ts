import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/_services/alert.service';
import { DriveService } from 'app/_services/drive.service';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss', '../../shared/shared.scss']
})
export class FeedbackListComponent implements OnInit {
  feedback = [];
  files = [];
  folderId = null;
  constructor(private drive: DriveService, private route: ActivatedRoute, public alert: AlertService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.route.url.subscribe(o => {
        this.folderId = o[1].path;
      });
      this.files = data.data.files;
      this.feedback = data.data.files.filter(o => (o.name as string).endsWith('.feedback'));
    });
  }
  delete(id: string) {
    this.alert.confirmDelete('Are you sure?').then(b => {
      this.drive.getFile(id).then(f => {
        const moderated: [] = f.moderated;
        const unmoderated: [] = f.unmoderated;
        const ids = [];
        for (let g = 0; g < moderated.length; g++) {
          ids.push((moderated[g] as any).id);
        }
        for (let g = 0; g < unmoderated.length; g++) {
          ids.push((unmoderated[g] as any).id);
        }
        this.alert.load(this.drive.deleteAll(id, ids)).then(p => {
          this.feedback = this.feedback.filter(i => i.id !== id);
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));
    }).catch(err => err);
  }
}
