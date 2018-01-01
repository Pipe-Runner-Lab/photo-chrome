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
  private index: number;
  private orientation: string; 

  // ---------------------------- Subscription ------------------------------
  private onSelectionCreatedSubscription:Subscription;
  
  onUploadButtonTrigger():void{
    this.fileInputElement.click();
  }

  onUpload(event:any):void {
    if (event.target.files) {  
      for( let i = 0, file; file = event.target.files[i]; i++ ){
        var reader = new FileReader();        
        reader.onload = (event) => {
          this.fileUrlList = [...this.fileUrlList,event.target['result']];
        }
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
    this.utilService.canvasCommand('DELETE',{});
  }

  addImageOnCanvas(url:string):void{
    this.utilService.addImageToCanvas(url);
  }

  changeAspectRatio(index: number){
    this.index = index;
    this.utilService.changeCanvasSize(this.orientation,index);
  }
  
  changeOrientation(orientation: string){
    this.orientation = orientation;
    this.utilService.changeCanvasSize(orientation,this.index);
  }

  constructor(private utilService: UtilService ) {
    this.selection = undefined;
    this.onSelectionCreatedSubscription = utilService.onSelectionCreated$.subscribe(
      ({selection}) => {
        this.selection = selection;
      }
    )

    this.index = 1;
    this.orientation = 'LANDSCAPE';
   }

  ngOnInit() {
    this.fileInputElement = document.getElementById('upload-file-input');
  }

  ngOnDestroy(){
    this.onSelectionCreatedSubscription.unsubscribe();
  }

}
