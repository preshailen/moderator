import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss', '../../shared/shared.scss']
})
export class InstructionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
	open(url: string) {
    window.open(url);
  }
}
