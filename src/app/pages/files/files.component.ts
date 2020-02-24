import { Component, OnInit } from '@angular/core';
import { DriveService } from 'app/_services/drive.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  signedIn: boolean = null;
  files: File[] = [];

  constructor(private ds: DriveService) { }

  ngOnInit() {
    this.ds.listFiles().then(
      v => {
        if (v.files.length > 0) {
          for (let d = 0; d < v.files.length; d++) {
            this.files.push(v.files[d]);
          }
          this.signedIn = true;
        } else {
          this.signedIn = false;
        }
      }
    );
  }

}
