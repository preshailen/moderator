import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'app/_services/alert.service';
import { ToastUiImageEditorComponent } from 'ngx-tui-image-editor';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../shared/shared.scss']
})
export class ViewComponent implements OnInit, AfterViewInit {
  @ViewChild(ToastUiImageEditorComponent, { static: false }) editor: ToastUiImageEditorComponent;
  comments = null;
  moderated = [];
  feedback = [];
  unmoderated = null;
  folderId = null;
  mForm: FormGroup = null;
  options = {
    includeUI: {
      loadImage: { path: 'https://picsum.photos/200/300', name: 'Blank' }
    },
    cssMaxWidth: 700,
    cssMaxHeight: 500,
    selectionStyle: { cornerSize: 20, rotatingPointOffset: 70 }
  };
  constructor(private route: ActivatedRoute, public alert: AlertService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.route.url.subscribe(k => {
        this.folderId = k[1].path;
      });
      this.comments = data.data['comments'];
      this.moderated = data.data['moderated'];
      this.unmoderated = data.data['unmoderated'];
      this.mForm = new FormGroup({
        currentFileChosen: new FormControl()
      });
      this.mForm.get('currentFileChosen').valueChanges.subscribe(b => {
        this.editor.editorInstance.loadImageFromURL('https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?id=' + b.id, 'workingPic').then(y => {
          this.editor.editorInstance.resizeCanvasDimension({ width: (y.newWidth * 0.5), height: y.newHeight });
        }).catch(err => console.log(err));
      });
    });
  }
  ngAfterViewInit() {
    document.getElementsByClassName('tui-image-editor-header')[0].remove();
    document.getElementsByClassName('tui-image-editor-controls')[0].remove();
  }
}
