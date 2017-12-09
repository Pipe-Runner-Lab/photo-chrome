import { Component, OnInit,ElementRef } from '@angular/core';
import 'fabric';

declare let fabric;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  private canvas;
  private boundBox;
  private shape;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas',{
      width: this.element.nativeElement.parentElement.clientWidth,
      height: this.element.nativeElement.parentElement.clientHeight,
    })
    this.boundBox = new fabric.Rect({
      width: 500,
      height: 500,
      fill:'transparent',
      stroke:'#000000',
      strokeDashArray:[5,5]
    });
    this.shape = new fabric.Rect(
      {
        width:200,
        height: 200,
        fill:'red'
      }
    )

    this.canvas.add(this.boundBox);
    this.canvas.add(this.shape);

    this.canvas.centerObject(this.boundBox);

  }

}
