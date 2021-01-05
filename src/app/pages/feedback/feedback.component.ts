import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss', '../../shared/shared.scss']
})
export class FeedbackComponent implements OnInit {
  comments = null;
  constructor(private route: ActivatedRoute) { }
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.comments = data.data['comments'];
    });
  }
}
