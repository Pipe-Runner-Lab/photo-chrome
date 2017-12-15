import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class UtilService {

  // --------------------- Add Image To Canvas ------------------------------
  private addImageToCanvasSource = new Subject<any>();
  addImageToCanvas$ = this.addImageToCanvasSource.asObservable();
  addImageToCanvas = (url) => {
    this.addImageToCanvasSource.next(url)
  }

  // --------------------- Add Text to Canvas -------------------------------
  private addTextToCanvasSource = new Subject<any>();
  addTextToCanvas$ = this.addTextToCanvasSource.asObservable();
  addTextToCanvas = (textObj) => {
    this.addTextToCanvasSource.next(textObj)
  }

  // --------------------- Edit Text ----------------------------------------
  private onUpdateTextSource = new Subject<any>();
  onUpdateText$ = this.onUpdateTextSource.asObservable();
  onUpdateText = (textObj) => {
    this.onUpdateTextSource.next(textObj)
  }

  // --------------------- On Change Tool type ------------------------------
  private changeToolTypeSource = new Subject<any>();
  changeToolType$ = this.changeToolTypeSource.asObservable();
  changeToolType = (toolType,activeObjectSettings) => {
    if(activeObjectSettings){
      this.changeToolTypeSource.next({
        toolType:toolType,
        activeObjectSettings:activeObjectSettings
      })
    }
    else{
      this.changeToolTypeSource.next({
        toolType:toolType
      })
    }
  }

  // --------------------- Crop Image ---------------------------------------

}
