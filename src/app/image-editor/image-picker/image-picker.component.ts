import { Component, OnInit } from '@angular/core';
// import {CanvasComponent} from '../canvas/canvas.component'

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.css']
})
export class ImagePickerComponent implements OnInit {

  fileInputElement: any;
  fileUrlList: string[] = [];
  loadingFiles: boolean;  //add loader while files is being loaded
  
  onUploadButtonTrigger():void{
    this.fileInputElement.click();
  }

  onUpload(event):void {
    if (event.target.files) {

      var reader = new FileReader();

      reader.onload = (event) => {
        this.fileUrlList = [...this.fileUrlList,event.target['result']];
        // console.log(this.fileUrlList);
      }

      for( let i = 0, file; file = event.target.files[i]; i++ ){
        reader.readAsDataURL(file)
      }
    }
  }

  onClearAll(){
    this.fileUrlList = [];
  }

  addImageOnCanvas(url){
    // this.canvasComponent.addImageOnCanvas(url)
  }

  constructor( ) { }

  ngOnInit() {
    this.fileInputElement = document.getElementById('upload-file-input');
  }

}
