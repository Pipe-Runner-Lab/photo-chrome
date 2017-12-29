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

  // --------------------- Adding Image filter ------------------------------
  private addImageFilterSource = new Subject<any>();
  addImageFilter$ = this.addImageFilterSource.asObservable();
  addImageFilter = (filterScope,filterProps) => {
    this.addImageFilterSource.next({filterScope,filterProps})
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
  onUpdateText = (textProps) => {
    this.onUpdateTextSource.next(textProps);
  }

  // --------------------- On Change Tool type ------------------------------
  private changeToolTypeSource = new Subject<any>();
  changeToolType$ = this.changeToolTypeSource.asObservable();
  changeToolType = (toolType,activeObjectProps) => {
    if(activeObjectProps){
      this.changeToolTypeSource.next({
        toolType:toolType,
        activeObjectProps:activeObjectProps
      })
    }
    else{
      this.changeToolTypeSource.next({
        toolType:toolType
      })
    }
  }

  // ----------------------- Object selection ---------------------------------
  private onSelectionCreatedSource = new Subject<any>();
  onSelectionCreated$ = this.onSelectionCreatedSource.asObservable();
  onSelectionCreated = (selection,selectionType,extraOptions) => {
    this.onSelectionCreatedSource.next({selection,selectionType,extraOptions});
  }

  //------------------------ canvas command -----------------------------------
  private canvasCommandSource = new Subject<any>();
  canvasCommand$ = this.canvasCommandSource.asObservable();
  canvasCommand = (toolType) => {
    this.canvasCommandSource.next(toolType);
  }

  //------------------------ open snackbar -------------------------------------
  private openSnackBarSource = new Subject<any>();
  openSnackBar$ = this.openSnackBarSource.asObservable();
  openSnackBar = (message,duration) => {
    this.openSnackBarSource.next({message,duration});
  }
}
