import { Component, OnInit } from '@angular/core';
// import {CanvasComponent} from '../canvas/canvas.component'
import { UtilService } from '../util.service';

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

  onUpload(event:any):void {
    if (event.target.files) {

      var reader = new FileReader();

      reader.onload = (event) => {
        this.fileUrlList = [...this.fileUrlList,event.target['result']];

      }

      for( let i = 0, file; file = event.target.files[i]; i++ ){
        reader.readAsDataURL(file)
      }
    }
  }

  onClearByIndex(indexToRemove:number):void{
    this.fileUrlList = this.fileUrlList.filter(
      (url,index) => index !== indexToRemove
    )
  }

  onClearAll(){
    this.fileUrlList = [];
  }

  addImageOnCanvas(url:string):void{
    this.utilService.addImageToCanvas(url);
  }

  constructor(private utilService: UtilService ) { }

  ngOnInit() {
    this.fileInputElement = document.getElementById('upload-file-input');
  }

}
