import { Component, OnInit } from '@angular/core';
import 'fabric';
import {UtilService} from '../util.service'
import { Subscription }   from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttleTime';

declare const fabric: any;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  private canvas: any;
  // private props: any = {
  //   canvasFill: '#ffffff',
  //   canvasImage: '',
  //   id: null,
  //   opacity: null,
  //   fill: null,
  //   fontSize: null,
  //   lineHeight: null,
  //   charSpacing: null,
  //   fontWeight: null,
  //   fontStyle: null,
  //   textAlign: null,
  //   fontFamily: null,
  //   TextDecoration: ''
  // };

  private aspectRatioList: number[] = [(6/6),(8/6),(7/5),(6/4)]

  private textString: string;
  private url: string = '';
  private size: any = {
    height: Math.round(window.innerHeight - 150),
    width: Math.round((window.innerHeight - 150) * this.aspectRatioList[1]),
  };

  // private json: any;
  // private selected: any;

  // ------------------------------- subscribtion ------------------------------
  private addImageSubscription:Subscription;
  private addTextSubscription:Subscription;
  private onUpdateTextSubscription:Subscription;
  private windowResizeSubscription:Subscription;

  // ------------------------------- image adding ------------------------------ 

  addImageOnCanvas(url:string):void{
    console.log(url);
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        let scaleXFactor = (this.size.width - 50)/image.width;
        let scaleYFactor = (this.size.height - 50)/image.height;
        console.log(image.width);
        image.set({
          left: 25,
          top: 25,
          scaleX: scaleXFactor,
          scaleY: scaleYFactor,
          angle: 0,
          padding: 10,
          cornersize: 10,
          hasRotatingPoint: true
        });
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  // ------------------------------- image cloning ------------------------------ 

  clone() {
    let activeObject = this.canvas.getActiveObject(),
      activeGroup = this.canvas.getActiveGroup();

    if (activeObject) {
      let clone;
      switch (activeObject.type) {
        case 'rect':
          clone = new fabric.Rect(activeObject.toObject());
          break;
        case 'circle':
          clone = new fabric.Circle(activeObject.toObject());
          break;
        case 'triangle':
          clone = new fabric.Triangle(activeObject.toObject());
          break;
        case 'i-text':
          clone = new fabric.IText('', activeObject.toObject());
          break;
        case 'image':
          clone = fabric.util.object.clone(activeObject);
          break;
      }
      if (clone) {
        clone.set({ left: 10, top: 10 });
        this.canvas.add(clone);
        this.selectItemAfterAdded(clone);
      }
    }
  }

  // ------------------------------- text adding ------------------------------

  onAddText(textObj:object):void {
    let textString = textObj['text'];
    let text = new fabric.IText(textString, {
      left: 10,
      top: 10,
      angle: 0,
      opacity : 10,
      fontFamily: textObj['fontFamily'],
      fontSize:textObj['fontSize'],
      fontWeight: textObj['fontWeight'],
      fontStyle: textObj['fontStyle'],
      fill: textObj['color'],
      underline: textObj['underline'],
      linethrough: textObj['linethrough'],
      hasRotatingPoint: true
    });
    this.extend(text, this.randomId());
    this.canvas.add(text);
    this.selectItemAfterAdded(text);
    this.textString = '';
  }

  onSelectText(textObject):void{
    const fontFamily = this.getObjectStyle('fontFamily',textObject);
    const fontSize = this.getObjectStyle('fontSize',textObject);
    const fontWeight = this.getObjectStyle('fontWeight',textObject);
    const fontStyle = this.getObjectStyle('fontStyle',textObject);
    const fill = this.getObjectStyle('fill',textObject);
    const underline = this.getObjectStyle('underline',textObject);
    const linethrough = this.getObjectStyle('linethrough',textObject);
    
    this.utilService.changeToolType('TEXT:EDITING',{
      fontFamily:fontFamily,
      fontSize:fontSize,
      fontWeight:fontWeight,
      fontStyle:fontStyle,
      color:fill,
      underline:underline,
      linethrough:linethrough
    });
  }

  onUpdateText(textObject):void{
    // fix this shit
    console.log(textObject);
    const activeTextObject = this.getActiveSelection();
    activeTextObject.fontFamily = textObject.fontFamily;
    activeTextObject.fontSize = textObject.fontSize;
    activeTextObject.fontWeight = textObject.fontWeight;
    activeTextObject.fontStyle = textObject.fontStyle;
    activeTextObject.fill = textObject.color;
    activeTextObject.underline = textObject.underline;
    activeTextObject.linethrough = textObject.linethrough;

    this.canvas.renderAll();
  }

  onUpdateTextonCanvas():void{

  }

  // ------------------------------- utility ----------------------------------
  
  getObjectStyle(styleName:string,object:object):any{
      return object[styleName];
  }

  setObjectStyle(styleName:string,value:any,object:object):void{
    // set style
  }

  selectItemAfterAdded(obj) {
    this.canvas.discardActiveObject();
    this.canvas.setActiveObject(obj).renderAll();
  }

  getActiveSelection():any{
    const selectionList = this.canvas.getActiveObjects();
    if(selectionList.length === 1){
      const activeObject = selectionList[0];
      switch (activeObject.type) {
        case 'image':
          return {
            type:'IMAGE',
            activeObject: activeObject
          };
        case 'i-text':
          return {
            type:'TEXT',
            activeObject: activeObject
          };
        default:
          return {
            type:'UNKNOWN'
          }
      }
    }
    else{
      return {
        type:'GROUP',
        activeObjectList: selectionList
      }
    }
  }

  cleanSelect() {
    // this.canvas.deactivateAllWithDispatch().renderAll();
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  extend(obj, id) {
    obj.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          id: id
        });
      };
    })(obj.toObject);
  }


  constructor(private utilService: UtilService ) {
    this.addImageSubscription = utilService.addImageToCanvas$.subscribe(
      url => {
        this.addImageOnCanvas(url);
      }
    )

    this.addTextSubscription = utilService.addTextToCanvas$.subscribe(
      textObj => {
        this.onAddText(textObj);
      }
    )

    this.onUpdateTextSubscription = utilService.onUpdateText$.subscribe(
      textObj => {
        this.onUpdateText(textObj);
      }
    )

    this.windowResizeSubscription = Observable.fromEvent(window,'resize').throttleTime(350).subscribe(
      ()=>{
          this.size.height = Math.round(window.innerHeight - 150);
          this.size.width = Math.round((window.innerHeight - 150) * this.aspectRatioList[1]);
          this.canvas.setWidth(this.size.width);
          this.canvas.setHeight(this.size.height);
      }
    )
  }

  ngOnInit() {
    // Setting up fabric object on canvas
    this.canvas = new fabric.Canvas('canvas', {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: '#B3E5FC'
    }); 

    // Default size of canvas
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);

    // Setup event listeners for canvas
    this.canvas.on({
      'selection:created':(event)=>{
        const selectionType = this.getActiveSelection().type;

        switch (selectionType) {
          case 'TEXT':
            this.onSelectText(this.getActiveSelection().activeObject);
            break;
          case 'IMAGE':
            // this.onSelectText(this.getActiveSelection().activeObject);
            break;        
          default:
            break;
        }
      },
      'object:modified':(event)=>{
        // Updating toolbar with updates
        console.log('object modified');
      },
      'selection:cleared':(event)=>{
        // Set the toolbar back to normal
        this.utilService.changeToolType('MAIN',undefined);
      }
    })
  }

  ngOnDestroy(){
    this.canvas.off();

    this.addImageSubscription.unsubscribe();
    this.addTextSubscription.unsubscribe();
    this.onUpdateTextSubscription.unsubscribe();
    this.windowResizeSubscription.unsubscribe();
  }

}
