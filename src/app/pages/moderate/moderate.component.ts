import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastUiImageEditorComponent } from 'ngx-tui-image-editor';

@Component({
  selector: 'app-moderate',
  templateUrl: './moderate.component.html',
  styleUrls: ['./moderate.component.scss']
})
export class ModerateComponent implements OnInit, AfterViewInit {
  @ViewChild(ToastUiImageEditorComponent, { static: false }) editor: ToastUiImageEditorComponent;
  files = [];
  mForm: FormGroup = null;
  options = {
    includeUI: {
      loadImage: { path: 'https://picsum.photos/200/300', name: 'Blank' },
      menu: ['text', 'draw'],
      menuBarPosition: 'bottom'
    },
    cssMaxWidth: 700,
    cssMaxHeight: 500,
    selectionStyle: { cornerSize: 20, rotatingPointOffset: 70 }
  };
  constructor(private route: ActivatedRoute) { }
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.files = data.data['data'];
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
  }
  save() {
   console.log(this.mForm.value)
  }
}
