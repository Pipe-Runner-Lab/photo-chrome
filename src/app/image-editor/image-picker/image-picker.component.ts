import { Component, OnInit } from '@angular/core';
import { UtilService } from '../util.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.css']
})
export class ImagePickerComponent implements OnInit {

  private fileInputElement: any;
  private fileUrlList: string[] = [];
  private loadingFiles: boolean;  //add loader while files is being loaded
  private selection:any;

  // ---------------------------- Subscription ------------------------------
  private onSelectionCreatedSubscription:Subscription;
  
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
        // unable to load multiple files.. probably getting re rendered
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

  onRemoveObjectFromCanvas(){
    this.utilService.onSelectionModified('DELETE');
  }

  addImageOnCanvas(url:string):void{
    this.utilService.addImageToCanvas(url);
  }

  constructor(private utilService: UtilService ) {
    this.selection = undefined;
    this.onSelectionCreatedSubscription = utilService.onSelectionCreated$.subscribe(
      ({selection}) => {
        this.selection = selection;
      }
    )
   }

  ngOnInit() {
    this.fileInputElement = document.getElementById('upload-file-input');
  }

}
