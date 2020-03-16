import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  id: string;
  files = [];
  uploadForm: FormGroup;
  constructor(private route: ActivatedRoute) { }
  ngOnInit() {
    this.route.data.subscribe(data => this.id = data.data.id);
    this.uploadForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
  }
  onFileChanges($event: any) {
     this.files = $event.srcElement.files;
  }
}
