import { Component, OnInit } from '@angular/core';
import 'fabric';
import {UtilService} from '../util.service'
import { Subscription }   from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';

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

  // Croping 
  private overlay:any;
  private croppingWindow:any;

  // Editor properties
  private screenReductionFactor:number = 180;
  private aspectRatioList: number[] = [(6/6),(8/6),(7/5),(6/4)]

  // Global Scope Tool values
  private globalFilterValues = {
    brightness:0,
    contrast:0,
    saturation:0,
    hue:0,
    noise:0,
    blur:0,
    pixelate:0,
    sharpen:false,
    emboss:false,
    grayscale:false,
    vintage:false,
    sepia:false,
    polaroid:false
  };

  // Tool default values
  private defaultTextProps = {
    text:'Sample Text',
    color:'#7F7F7F',
    opacity:1,
    fontFamily:'Roboto',
    fontSize:24,
    fontWeight:'normal',
    fontStyle:'normal',
    underline:false,
    linethrough:false,
    textAlign:'left',
    lineHeight:1.6,
    charSpacing:0
  }

  // canvas size preperty
  private size: any = {
    height: Math.round(window.innerHeight - this.screenReductionFactor),
    width: Math.round((window.innerHeight - this.screenReductionFactor) * this.aspectRatioList[3]),
  };
  // private oldSize: any = {
  //   height:this.size.height,
  //   width:this.size.width,
  // }

  // private json: any;
  // private selected: any;

  // ------------------------------- subscribtion ------------------------------
  // private windowResizeSubscription:Subscription;
  // private objectResizeSubscription:Subscription;
  private addImageSubscription:Subscription;
  private addImageFilterSubscription:Subscription;
  private addTextSubscription:Subscription;
  private onUpdateTextSubscription:Subscription;
  private onSelectionModifiedSubscription:Subscription;
  private canvasCommandSubscription:Subscription;

  // ------------------------------- image -------------------------------------- 

  onSelectImage(imageObject):void{
    this.utilService.changeToolType('FILTER:SINGLE',this.getActiveFilter(imageObject));
  }

  addImageOnCanvas(url:string):void{
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        let scaleXFactor = (this.size.width - 20)/image.width;
        let scaleYFactor = scaleXFactor;
        image.set({
          left: 10,
          top: 10,
          scaleX: scaleXFactor,
          scaleY: scaleYFactor,
          angle: 0,
          cornersize: 10,
          hasRotatingPoint: true
        });
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  applyFilterOnSingle(filterProps:any):void{
    if(this.activeObjectType === 'image'){
      this.activeObject.filters = this.generateFilterArray(filterProps);
      this.activeObject.applyFilters();
      this.canvas.renderAll();
    }
  }

  applyFilterOnAll(filterProps:any):void{
    this.globalFilterValues = filterProps;
    const globalFilter = this.generateFilterArray(filterProps);
    this.canvas.forEachObject((object)=>{
      if(object.type === 'image'){
        object.filters = globalFilter;
        object.applyFilters();
      }
    })
    this.canvas.renderAll();
  }

  flipSelectedImage(){
    if(this.activeObjectType === 'image'){
      this.activeObject.flipX = this.activeObject.flipX ? !this.activeObject.flipX : true;
    }
    this.canvas.renderAll();
  }

  // ------------------------------- cropping -----------------------------------
  startCrop(){
    console.log('cropping started');
    this.cleanSelect();
    this.overlay = new fabric.Rect({
      left: 0,
      top: 0,
      fill: '#000000',
      opacity:0.5,
      width: this.size.width,
      height: this.size.height,
    });
    this.canvas.add(this.overlay);
    this.canvas.forEachObject((object)=>{
      object.selectable = false;
    })
     this.croppingWindow = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'transparent',
      borderColor:'#ffffff',
      cornerColor:'#ffffff',
      borderOpacityWhenMoving:1,
      hasRotatingPoint:false,
      padding:0,
      width: 200,
      height: 200,
    });
    this.canvas.add(this.croppingWindow);
    this.selectItemAfterAdded(this.croppingWindow);
    this.canvas.renderAll();
  }

  cropSelectedWindow(){
    const width = this.croppingWindow.getScaledWidth()
    const height = this.croppingWindow.getScaledHeight()
    this.canvas.forEachObject(
      (object)=>{
        if(object.type === 'image'){
          const objectWidth = object.getScaledWidth();
          const objectHeight = object.getScaledHeight();
          let x = (objectWidth/2) - (this.croppingWindow.left - object.left);
          let y = (objectHeight/2) - (this.croppingWindow.top - object.top);
          x = x * (1/object.scaleX);
          y = y * (1/object.scaleY);
          console.log(-x,-y);
          
          object.clipTo = (ctx) =>{
            ctx.rect(-x,-y,width * (1/object.scaleX),height * (1/object.scaleY));
          }
        }
      }
    )
    this.stopCrop();
  }

  stopCrop(){
    this.canvas.remove(this.overlay);
    this.canvas.remove(this.croppingWindow);
    this.canvas.forEachObject((object)=>{
      object.selectable = true;
    })
    this.canvas.renderAll();

    this.croppingWindow = undefined;
    this.overlay = undefined;
  }

  // ------------------------------- image cloning ------------------------------ 

  // clone() {
  //   let activeObject = this.canvas.getActiveObject(),
  //     activeGroup = this.canvas.getActiveGroup();

  //   if (activeObject) {
  //     let clone;
  //     switch (activeObject.type) {
  //       case 'rect':
  //         clone = new fabric.Rect(activeObject.toObject());
  //         break;
  //       case 'circle':
  //         clone = new fabric.Circle(activeObject.toObject());
  //         break;
  //       case 'triangle':
  //         clone = new fabric.Triangle(activeObject.toObject());
  //         break;
  //       case 'i-text':
  //         clone = new fabric.IText('', activeObject.toObject());
  //         break;
  //       case 'image':
  //         clone = fabric.util.object.clone(activeObject);
  //         break;
  //     }
  //     if (clone) {
  //       clone.set({ left: 10, top: 10 });
  //       this.canvas.add(clone);
  //       this.selectItemAfterAdded(clone);
  //     }
  //   }
  // }

  // ------------------------------- text -------------------------------------

  onSelectText(textObject):void{    
    this.utilService.changeToolType(this.toolType,{
      fontFamily:textObject['fontFamily'],
      fontSize:textObject['fontSize'],
      fontWeight:textObject['fontWeight'],
      fontStyle:textObject['fontStyle'],
      color:textObject['fill'],
      opacity:textObject['opacity'],
      underline:textObject['underline'],
      linethrough:textObject['linethrough'],
      textAlign:textObject['textAlign'],
      lineHeight:textObject['lineHeight'],
      charSpacing:textObject['charSpacing']
    });
  }

  onSelectTextEditing(textObject):void{
    if(textObject.isEditing){
      const startIndex = textObject.selectionStart;
      const endIndex = textObject.selectionEnd;
      if(startIndex!==endIndex){
        this.utilService.changeToolType(this.toolType,textObject.getSelectionStyles()[0]);
      }
      else{
        this.utilService.changeToolType(this.toolType,{
          isSelectionInactive:true
        });
      }
    }
  }

  onAddText():void {
    const textObject = new fabric.IText(this.defaultTextProps['text'], {
      left: 10,
      top: 10,
      angle: 0,
      fontFamily: this.defaultTextProps['fontFamily'],
      fontSize:this.defaultTextProps['fontSize'],
      fontWeight: this.defaultTextProps['fontWeight'],
      fontStyle: this.defaultTextProps['fontStyle'],
      fill: this.defaultTextProps['color'],
      opacity : this.defaultTextProps['opacity'],
      underline: this.defaultTextProps['underline'],
      linethrough: this.defaultTextProps['linethrough'],
      textAlign: this.defaultTextProps['textAlign'],
      hasRotatingPoint: true,
      lockScalingX:true,
      lockScalingY:true,
    });
    this.extend(textObject, this.randomId());
    this.canvas.add(textObject);
    this.selectItemAfterAdded(textObject);
  }

  onUpdateText(textProps):void{
    if(this.activeObjectType==='i-text'){
      this.activeObject.set('fontFamily',textProps.fontFamily);
      this.activeObject.set('fontSize',textProps.fontSize);
      this.activeObject.set('fontWeight',textProps.fontWeight);
      this.activeObject.set('fontStyle', textProps.fontStyle);
      this.activeObject.set('fill',textProps.color);
      this.activeObject.set('opacity',textProps.opacity);
      this.activeObject.set('underline',textProps.underline);
      this.activeObject.set('linethrough',textProps.linethrough);
      this.activeObject.set('textAlign',textProps.textAlign);
      this.activeObject.set('lineHeight',textProps.lineHeight);
      this.activeObject.set('charSpacing',textProps.charSpacing);
    }
    this.canvas.renderAll();
  }

  onUpdateTextEditing(textProps):void{
    if(this.activeObjectType==='i-text'){
      if( this.activeObject.isEditing ){
        this.activeObject.setSelectionStyles(textProps);
      }
    }
    this.canvas.renderAll();
  }

  // ------------------------------- utility ----------------------------------
  // resizeAllObjects(){
  //   console.log('resize initiated');
  // }
  
  getActiveFilter(imageObject){
    let activeFilter = {
      brightness:0,
      contrast:0,
      saturation:0,
      hue:0,
      noise:0,
      blur:0,
      pixelate:0,
      sharpen:false,
      emboss:false,
      grayscale:false,
      vintage:false,
      sepia:false,
      polaroid:false
    };
    imageObject.filters.map((filter)=>{
      switch (filter.type) {
        case 'Brightness':
          activeFilter = {...activeFilter,brightness:filter.brightness}  
          break;
        case 'Contrast':
          activeFilter = {...activeFilter,contrast:filter.contrast}  
          break;
        case 'Saturation':
          activeFilter = {...activeFilter,saturation:filter.saturation}  
          break;
        case 'HueRotation':
          activeFilter = {...activeFilter,hue:filter.rotation}  
          break;
        case 'Noise':
          activeFilter = {...activeFilter,noise:filter.noise}  
          break;
        case 'Blur':
          activeFilter = {...activeFilter,blur:filter.blur}  
          break;
        case 'Pixelate':
          activeFilter = {...activeFilter,pixelate:filter.blocksize}  
          break;
        case 'Grayscale':
          activeFilter = {...activeFilter,grayscale:true}  
          break;
        case 'Vintage':
          activeFilter = {...activeFilter,vintage:true}  
          break;
        case 'Sepia':
          activeFilter = {...activeFilter,sepia:true}  
          break;
        case 'Polaroid':
          activeFilter = {...activeFilter,polaroid:true}  
          break;
        case 'Convolute':
          if(filter.matrix === [ 0, -1,  0, -1,  5, -1, 0, -1,  0 ]){
            activeFilter = {...activeFilter,sharpen:true}; 
            
          }
          if(filter.matrix === [ 1,   1,  1, 1, 0.7, -1, -1,  -1, -1 ]){
            activeFilter = {...activeFilter,emboss:true};          
          }
          break;         
        default:
        break;
      }
    })
    return activeFilter;
  }

  generateFilterArray(filterProps:any):any[]{
    let filterArray = [];
    if(filterProps.brightness !== 0){
      filterArray.push(
        new fabric.Image.filters.Brightness({
          brightness:filterProps.brightness
        }
      ));
    }
    if(filterProps.contrast !== 0){
      filterArray.push(
        new fabric.Image.filters.Contrast({
          contrast:filterProps.contrast
        }
      ));
    }
    if(filterProps.saturation !== 0){
      filterArray.push(
        new fabric.Image.filters.Saturation({
          saturation:filterProps.saturation
        }
      ));
    }
    if(filterProps.hue !== 0){
      filterArray.push(
        new fabric.Image.filters.HueRotation({
          rotation:filterProps.hue
        }
      ));
    }
    if(filterProps.noise !== 0){
      filterArray.push(
        new fabric.Image.filters.Noise({
          noise:filterProps.noise
        }
      ));
    }
    if(filterProps.blur !== 0){
      filterArray.push(
        new fabric.Image.filters.Blur({
          blur:filterProps.blur
        }
      ));
    }
    if(filterProps.pixelate !== 0){
      filterArray.push(
        new fabric.Image.filters.Pixelate({
          blocksize:filterProps.pixelate
        }
      ));
    }
    if(filterProps.sharpen){
      filterArray.push(
        new fabric.Image.filters.Convolute({
          matrix: [ 0, -1,  0,
                   -1,  5, -1,
                    0, -1,  0 ]
        }
      ));
    }
    if(filterProps.emboss){
      filterArray.push(
        new fabric.Image.filters.Convolute({
          matrix: [ 1,   1,  1,
                    1, 0.7, -1,
                   -1,  -1, -1 ]
        }
      ));
    }
    if(filterProps.grayscale){
      filterArray.push(
        new fabric.Image.filters.Grayscale({
          mode:'lightness'
        }
      ));
    }
    if(filterProps.vintage){
      filterArray.push(
        new fabric.Image.filters.Vintage()
      );
    }
    if(filterProps.sepia){
      filterArray.push(
        new fabric.Image.filters.Sepia()
      );
    }
    if(filterProps.polaroid){
      filterArray.push(
        new fabric.Image.filters.Polaroid()
      );
    }
    return filterArray;
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

  bringForward(){
    if(this.activeObjectType !== 'group' && this.activeObject !== undefined ){
      this.activeObject.bringForward();
      this.canvas.discardActiveObject().renderAll();
    }
  }

  sendBackward(){
    if(this.activeObjectType !== 'group' && this.activeObject !== undefined ){
      this.activeObject.sendBackwards();
      this.canvas.discardActiveObject().renderAll();
    }
  }

  // ------------------------- Canvas Event Handlers --------------------------

  onObjectSelected():void{
    const activeObjectSelection = this.getActiveSelection();
    this.activeObjectType = activeObjectSelection.type;

    if(this.activeObjectType === 'group'){
      this.activeObjectList = activeObjectSelection.activeObjectList;
      this.utilService.onSelectionCreated(this.activeObjectList,this.activeObjectType,{});
      this.utilService.changeToolType('DEACTIVATE',{});
    }
    else{
      this.activeObject = activeObjectSelection.activeObject;
      switch (this.activeObjectType) {
        case 'i-text':
          this.toolType = 'TEXT'              
          this.onSelectText(this.activeObject);
          break;
        case 'image':
          // this.toolType = 'FILTER'
          if(this.toolType === 'FILTER:ALL'){
            this.toolType = 'FILTER:SINGLE';
            this.onSelectImage(this.activeObject)
          }
          break;        
        default:
          break;
      }
      this.utilService.onSelectionCreated(this.activeObject,this.activeObjectType,{});
    }
  }

  onObjectDeselected():void{
    // Turn off crop mode
    if(this.croppingWindow){
      this.stopCrop();
    }

    switch (this.activeObjectType) {
      case 'image':
        // Don't change to MAIN menu for image
        if(this.toolType === 'FILTER:SINGLE'){
          this.toolType = 'FILTER:ALL';
        }
        this.activeObjectType = '';
        this.activeObject = undefined;
        this.activeObjectList = [];
        this.utilService.changeToolType(this.toolType,this.activeObject);
        this.utilService.onSelectionCreated(this.activeObject,this.activeObjectType,{});
        break;    
      default:
        this.toolType = 'MAIN';
        this.activeObjectType = '';
        this.activeObject = undefined;
        this.activeObjectList = [];
        this.utilService.changeToolType(this.toolType,this.activeObject);
        this.utilService.onSelectionCreated(this.activeObject,this.activeObjectType,{});
        break;
    }
  }

  onEnterningTextEditingMode(){
    const activeObjectSelection = this.getActiveSelection();
    this.toolType = 'TEXT:EDITING'
    this.activeObjectType = activeObjectSelection.type;
    this.activeObject = activeObjectSelection.activeObject;
    if(this.activeObjectType === 'i-text'){
      this.onSelectTextEditing(this.activeObject);
    }
  }

  onExitingTextEditingMode(){
    this.toolType = 'MAIN';
    this.activeObjectType = '';
    this.activeObject = undefined;
    this.activeObjectList = [];
    this.utilService.changeToolType(this.toolType,undefined);
  }

  onTextSelectionChange(){
    if(this.activeObjectType === 'i-text'){
      this.onSelectTextEditing(this.activeObject);
    }
  }


  constructor(private utilService: UtilService ) {
    this.addImageSubscription = utilService.addImageToCanvas$.subscribe(
      url => {
        this.addImageOnCanvas(url);
      }
    )

    this.addTextSubscription = utilService.addTextToCanvas$.subscribe(
      textProps => {
        this.onAddText();
      }
    )
    
    this.addImageFilterSubscription = utilService.addImageFilter$.subscribe(
      ({filterScope,filterProps})=>{
        switch (filterScope) {
          case 'SINGLE':
            this.applyFilterOnSingle(filterProps);
            break;
          case 'ALL':
            this.applyFilterOnAll(filterProps);
            break;
          default:
            break;
        }
      }
    )

    this.onUpdateTextSubscription = utilService.onUpdateText$.subscribe(
      (textProps) => {
        switch (this.toolType) {
          case 'TEXT':
            this.onUpdateText(textProps);
            break;
          case 'TEXT:EDITING':
            this.onUpdateTextEditing(textProps);
            break;
          default:
            break;
        }
      }
    )

    this.canvasCommandSubscription = utilService.canvasCommand$.subscribe(
      (toolType) => {
        switch (toolType) {
          case 'ADD_FILTER':
            if(this.activeObjectType==='image'){
              this.toolType = 'FILTER:SINGLE';
              this.utilService.changeToolType('FILTER:SINGLE',this.getActiveFilter(this.activeObject));
            }
            else if(this.activeObjectType===''){
              this.toolType = 'FILTER:ALL';
              this.utilService.changeToolType('FILTER:ALL',this.globalFilterValues);
            }
            break;
          case 'FILTER:ALL':
            this.cleanSelect();
            this.utilService.changeToolType('FILTER:ALL',this.globalFilterValues);
            break;
          case 'ADD_TEXT':
            this.onAddText();
            break;
          case 'CLEAN_SELECT':
            this.cleanSelect();
            break;
          case 'BACK_TO_MAIN_MENU':
            if(this.activeObjectType!=='image'){
              this.cleanSelect();
            }
            break;
          case 'DELETE':
            this.removeSelection();
            this.onObjectDeselected();
            break;
          case 'BRING_FORWARD':
            this.bringForward();
            break;
          case 'SEND_BACKWARD':
            this.sendBackward();
            break;
          case 'START_CROP':
            this.startCrop();
            this.utilService.changeToolType('CROP',{});
            break;
          case 'STOP_CROP':
            this.onObjectDeselected();
            break;
          case 'FINISH_CROP':
            this.cropSelectedWindow();
            break;
          case 'FLIP:X':
            this.flipSelectedImage();
            break;
          default:
            break;
        }
      }
    )

    // this.windowResizeSubscription = Observable.fromEvent(window,'resize').filter(()=>(window.innerHeight>720)).throttleTime(100).subscribe(
    //   ()=>{
    //       this.size.height = Math.round(window.innerHeight - this.screenReductionFactor);
    //       this.size.width = Math.round((window.innerHeight - this.screenReductionFactor) * this.aspectRatioList[1]);
    //       this.canvas.setWidth(this.size.width);
    //       this.canvas.setHeight(this.size.height);
    //   }
    // )

    // this.objectResizeSubscription = Observable.fromEvent(window,'resize').filter(()=>(window.innerHeight>720)).debounceTime(50).subscribe(
    //   ()=>{
    //     this.oldSize = this.size;
    //     this.resizeAllObjects();
    //   }
    // )
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
    fabric.textureSize = 4096;
    console.log(fabric.textureSize);

    // Initializing backend
    var webglBackend = new fabric.WebglFilterBackend();
    // var canvas2dBackend = new fabric.Canvas2dFilterBackend()
    fabric.filterBackend = fabric.initFilterBackend();

    // Default size of canvas
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);

    // Setup event listeners for canvas
    this.canvas.on({
      'selection:created':(event)=>{
        console.log('selection active');
        this.onObjectSelected();
      },
      'selection:updated':(event)=>{
        // same things as in created
        console.log('selection updated');
        this.onObjectSelected();
      },
      'selection:cleared':(event)=>{
        console.log('selection inactive');
        this.onObjectDeselected();
      },
      'object:modified':(event)=>{
        console.log('object modified');
      },
      'text:editing:entered':(event)=>{
        console.log('editing entered');
        this.onEnterningTextEditingMode();
      },
      'text:editing:exited':(event)=>{
        console.log('editing exit');
        this.onExitingTextEditingMode();
      },
      'text:selection:changed':(event)=>{
        // using preselected text object to optimize
        console.log('selection change');
        this.onTextSelectionChange();
      },
      'text:changed':(event)=>{
        console.log('text changed');
      },
    })
  }

  ngOnDestroy(){
    this.canvas.off();
    // this.windowResizeSubscription.unsubscribe();
    // this.objectResizeSubscription.unsubscribe();
    this.addImageSubscription.unsubscribe();
    this.addImageFilterSubscription.unsubscribe();
    this.addTextSubscription.unsubscribe();
    this.onUpdateTextSubscription.unsubscribe();
    this.canvasCommandSubscription.unsubscribe();
  }

}
