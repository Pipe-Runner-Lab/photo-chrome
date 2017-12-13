import { Component, OnInit, ElementRef } from '@angular/core';
import 'fabric';
import {UtilService} from '../util.service'
import { Subscription }   from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

declare const fabric: any;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  private canvas: any;
  private props: any = {
    canvasFill: '#ffffff',
    canvasImage: '',
    id: null,
    opacity: null,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    TextDecoration: ''
  };

  private aspectRatioList: number[] = [(6/6),(8/6),(7/5),(6/4)]

  private textString: string;
  private url: string = '';
  private size: any = {
    height: window.innerHeight - 120,
    width: Math.round((window.innerHeight - 120) * this.aspectRatioList[1]),
  };

  private json: any;
  private globalEditor: boolean = false;
  private textEditor: boolean = false;
  private imageEditor: boolean = false;
  private figureEditor: boolean = false;
  private selected: any;

  // ------------------------------- subscribtion ------------------------------
  private addImageSubscription:Subscription;
  private windowResizeSubscription:Subscription;

  // ------------------------------- image -------------------------------------  

  addImageOnCanvas(url:string):void{
    console.log(url);
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornersize: 10,
          hasRotatingPoint: true
        });
        // image.setWidth(this.size.width);
        // image.setHeight(this.size.height);
        // this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  // ------------------------------- utility ----------------------------------

  extend(obj, id) {
    obj.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          id: id
        });
      };
    })(obj.toObject);
  }

  selectItemAfterAdded(obj) {
    this.canvas.deactivateAllWithDispatch().renderAll();
    this.canvas.setActiveObject(obj);
  }

  constructor( private elementRef: ElementRef, private utilService: UtilService ) {
    this.addImageSubscription = utilService.addImageToCanvas$.subscribe(
      url => {
        this.addImageOnCanvas(url);
      }
    )

    this.windowResizeSubscription = Observable.fromEvent(window,'resize').subscribe(
      ()=>{
          this.size.height = window.innerHeight - 120;
          this.size.width = Math.round((window.innerHeight - 120) * this.aspectRatioList[1]);
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
  }

  ngOnDestroy(){
    this.addImageSubscription.unsubscribe();
    this.windowResizeSubscription.unsubscribe();
  }

}
