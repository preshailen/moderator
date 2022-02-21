import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertService } from 'app/_services/alert.service';
import { ToastUiImageEditorComponent } from 'ngx-tui-image-editor';
import { AuthorizationService } from 'app/_services/auth.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss', '../../shared/shared.scss']
})
export class FeedbackComponent implements OnInit, AfterViewInit {
	@ViewChild(ToastUiImageEditorComponent, { static: false }) editor: ToastUiImageEditorComponent;
  comments: string = null;
	moderated: any[] = [];
	mForm: FormGroup = null;
	options = {
    includeUI: {
      loadImage: { path: 'https://picsum.photos/200/300', name: 'Blank' }
    },
    cssMaxWidth: 700,
    cssMaxHeight: 500,
    selectionStyle: { cornerSize: 20, rotatingPointOffset: 70 }
  };
  constructor(public aService: AuthorizationService, private route: ActivatedRoute, public alService: AlertService) { }
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.comments = data.data['comments'];
			this.moderated = data.data['moderated'];
      this.mForm = new FormGroup({
        currentFileChosen: new FormControl()
      });
			this.mForm.get('currentFileChosen').valueChanges.subscribe(b => {
        this.editor.editorInstance.loadImageFromURL(this.aService.getCorsFix() + 'https://drive.google.com/uc?id=' + b.id, 'workingPic').then(y => {
          this.editor.editorInstance.resizeCanvasDimension({ width: (y.newWidth * 0.5), height: y.newHeight });
        }).catch(err => console.log(err));
      });
			setTimeout(() => {
        this.mForm.get('currentFileChosen').setValue(this.moderated[0]);
      }, 2000);
    });
  }
	ngAfterViewInit() {
    document.getElementsByClassName('tui-image-editor-header')[0].remove();
    document.getElementsByClassName('tui-image-editor-controls')[0].remove();
  }
	goBack() {
		this.alService.navigate('feedback-list');
	}
}
