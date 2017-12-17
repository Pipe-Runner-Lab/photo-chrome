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
  private toolType: string;
  private activeObjectType: string;
  private activeObject: any;
  private activeObjectList: any;

  private screenReductionFactor:number = 180;
  private aspectRatioList: number[] = [(6/6),(8/6),(7/5),(6/4)]

  private textString: string;
  private url: string = '';
  private size: any = {
    height: Math.round(window.innerHeight - this.screenReductionFactor),
    width: Math.round((window.innerHeight - this.screenReductionFactor) * this.aspectRatioList[3]),
  };

  // private json: any;
  // private selected: any;

  // ------------------------------- subscribtion ------------------------------
  private addImageSubscription:Subscription;
  private addTextSubscription:Subscription;
  private onUpdateTextSubscription:Subscription;
  private windowResizeSubscription:Subscription;
  private onSelectionModifiedSubscription:Subscription;

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

  onAddText(textProps:object):void {
    const textObject = new fabric.IText(textProps['text'], {
      left: 10,
      top: 10,
      angle: 0,
      fontFamily: textProps['fontFamily'],
      fontSize:textProps['fontSize'],
      fontWeight: textProps['fontWeight'],
      fontStyle: textProps['fontStyle'],
      fill: textProps['color'],
      opacity : textProps['opacity'],
      underline: textProps['underline'],
      linethrough: textProps['linethrough'],
      textAlign: textProps['textAlign'],
      hasRotatingPoint: true,
      lockScalingX:true,
      lockScalingY:true,
    });
    this.extend(textObject, this.randomId());
    this.canvas.add(textObject);
    this.selectItemAfterAdded(textObject);
  }

  onSelectText(textObject):void{
    const fontFamily = textObject['fontFamily'];
    const fontSize = textObject['fontSize'];
    const fontWeight = textObject['fontWeight']
    const fontStyle = textObject['fontStyle'];
    const fill = textObject['fill'];
    const opacity = textObject['opacity'];
    const underline = textObject['underline'];
    const linethrough = textObject['linethrough'];
    const textAlign = textObject['textAlign'];
    const lineHeight = textObject['lineHeight'];
    const charSpacing = textObject['charSpacing'];
    
    this.utilService.changeToolType(this.toolType,{
      fontFamily:fontFamily,
      fontSize:fontSize,
      fontWeight:fontWeight,
      fontStyle:fontStyle,
      color:fill,
      opacity:opacity,
      underline:underline,
      linethrough:linethrough,
      textAlign:textAlign,
      lineHeight:lineHeight,
      charSpacing:charSpacing
    });
  }

  onAdvancedSelectText(textObject):void{
    // if(textObject.isEditing){
    //   // const startIndex = textObject.selectionStart;
    //   // const endIndex = textObject.selectionEnd;
    //   console.log(textObject.getSelectionStyles())
    // }
    this.utilService.changeToolType(this.toolType,{});
  }

  onUpdateText(textProps):void{
    const activeTextObject = this.activeObject;
    activeTextObject.set('fontFamily',textProps.fontFamily);
    activeTextObject.set('fontSize',textProps.fontSize);
    activeTextObject.set('fontWeight',textProps.fontWeight);
    activeTextObject.set('fontStyle', textProps.fontStyle);
    activeTextObject.set('fill',textProps.color);
    activeTextObject.set('opacity',textProps.opacity);
    activeTextObject.set('underline',textProps.underline);
    activeTextObject.set('linethrough',textProps.linethrough);
    activeTextObject.set('textAlign',textProps.textAlign);
    activeTextObject.set('lineHeight',textProps.lineHeight);
    activeTextObject.set('charSpacing',textProps.charSpacing);
    this.canvas.renderAll();
  }

  onAdvancedUpdateText(textProps):void{
    const activeObject = this.activeObject;
    if( activeObject.isEditing ){
      activeObject.setSelectionStyles(textProps);
    }
    this.canvas.renderAll();
  }

  // ------------------------------- utility ----------------------------------

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
            type:'image',
            activeObject: activeObject
          };
        case 'i-text':
          return {
            type:'i-text',
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
        type:'group',
        activeObjectList: selectionList
      }
    }
  }

  cleanSelect() {
    this.canvas.discardActiveObject().renderAll();
  }

  removeSelection(){
    if(this.activeObjectType === 'group'){
      console.log('deleting group');
      this.activeObjectList.map((activeObject,index)=>{
        this.canvas.remove(activeObject);
      },this)
    }
    else{
      this.canvas.remove(this.activeObject);
    }
    this.cleanSelect();
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
      textProps => {
        this.onAddText(textProps);
      }
    )

    this.onUpdateTextSubscription = utilService.onUpdateText$.subscribe(
      (textProps) => {
        switch (this.toolType) {
          case 'TEXT:EDITING':
            this.onUpdateText(textProps);
            break;
          case 'TEXT:EDITING-ADVANCED':
            this.onAdvancedUpdateText(textProps);
            break;
          default:
            break;
        }
      }
    )

    this.onSelectionModifiedSubscription = utilService.onSelectionModified$.subscribe(
      (modificationType) => {
        switch (modificationType) {
          case 'DELETE':
            this.removeSelection();
            break;
        
          default:
            break;
        }
      }
    )

    this.windowResizeSubscription = Observable.fromEvent(window,'resize').throttleTime(250).subscribe(
      ()=>{
          this.size.height = Math.round(window.innerHeight - this.screenReductionFactor);
          this.size.width = Math.round((window.innerHeight - this.screenReductionFactor) * this.aspectRatioList[1]);
          this.canvas.setWidth(this.size.width);
          this.canvas.setHeight(this.size.height);
      }
    )
  }

  ngOnInit() {
    // Setting up editor default setting
    this.toolType = 'MAIN';
    this.activeObjectType = ''
    this.activeObject = undefined;
    this.activeObjectList = [];

    // Setting up fabric object on canvas
    this.canvas = new fabric.Canvas('canvas', {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: '#B3E5FC',
      backgroundColor:'#ffffff'
    }); 

    // Default size of canvas
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);

    // Setup event listeners for canvas
    this.canvas.on({
      'selection:created':(event)=>{
        console.log('selection active');
        const activeObjectSelection = this.getActiveSelection();
        this.activeObjectType = activeObjectSelection.type;

        if(this.activeObjectType === 'group'){
          this.activeObjectList = activeObjectSelection.activeObjectList;
          this.utilService.onSelectionCreated(this.activeObject,this.activeObjectType,{});
        }
        else{
          this.activeObject = activeObjectSelection.activeObject;
          switch (this.activeObjectType) {
            case 'i-text':
              this.toolType = 'TEXT:EDITING'              
              this.onSelectText(this.activeObject);
              break;
            case 'image':
              //call function for image selection
              break;        
            default:
              break;
          }
          this.utilService.onSelectionCreated(this.activeObject,this.activeObjectType,{});
        }
      },
      'selection:updated':(event)=>{
        // same things as in created
        console.log('selection updated');
        const activeObjectSelection = this.getActiveSelection();
        this.activeObjectType = activeObjectSelection.type;

        if(this.activeObjectType === 'group'){
          this.activeObjectList = activeObjectSelection.activeObjectList;
          this.utilService.onSelectionCreated(this.activeObject,this.activeObjectType,{});
        }
        else{
          this.activeObject = activeObjectSelection.activeObject;
          switch (this.activeObjectType) {
            case 'i-text':
              this.toolType = 'TEXT:EDITING'              
              this.onSelectText(this.activeObject);
              break;
            case 'image':
              //call function for image selection
              break;        
            default:
              break;
          }
          this.utilService.onSelectionCreated(this.activeObject,this.activeObjectType,{});
        }
      },
      'selection:cleared':(event)=>{
        console.log('selection inactive');
        this.toolType = 'MAIN';
        this.activeObjectType = '';
        this.activeObject = undefined;
        this.activeObjectList = [];
        this.utilService.changeToolType(this.toolType,this.activeObject);
        this.utilService.onSelectionCreated(this.activeObject,this.activeObjectType,{});
      },
      'object:modified':(event)=>{
        console.log('object modified');
      },
      'text:editing:entered':(event)=>{
        console.log('editing entered');
        const activeObjectSelection = this.getActiveSelection();
        this.toolType = 'TEXT:EDITING-ADVANCED'
        this.activeObjectType = activeObjectSelection.type;
        this.activeObject = activeObjectSelection.activeObject;
        if(this.activeObjectType === 'i-text'){
          this.onAdvancedSelectText(this.activeObject);
        }
      },
      'text:editing:exited':(event)=>{
        console.log('editing exit');
        this.toolType = 'MAIN';
        this.activeObjectType = '';
        this.activeObject = undefined;
        this.activeObjectList = [];
        this.utilService.changeToolType(this.toolType,this.activeObject);
      },
      'text:selection:changed':(event)=>{
        // using preselected text object to optimize
        console.log('selection change');
        if(this.activeObjectType === 'i-text'){
          this.onAdvancedSelectText(this.activeObject);
        }
      },
      'text:changed':(event)=>{
        console.log('text changed');
      },
    })
  }

  ngOnDestroy(){
    this.canvas.off();

    this.addImageSubscription.unsubscribe();
    this.addTextSubscription.unsubscribe();
    this.onUpdateTextSubscription.unsubscribe();
    this.windowResizeSubscription.unsubscribe();
    this.onSelectionModifiedSubscription.unsubscribe();
  }

}
