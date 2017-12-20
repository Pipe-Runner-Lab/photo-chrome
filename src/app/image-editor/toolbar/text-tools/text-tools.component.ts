import { Component, OnInit, Input } from '@angular/core';
import {UtilService} from '../../util.service';

@Component({
  selector: 'app-text-tools',
  templateUrl: './text-tools.component.html',
  styleUrls: ['./text-tools.component.css']
})
export class TextToolsComponent implements OnInit {

  @Input() selectedToolType;
  @Input() activeObjectProps;

  // private text:string;
  private color:string;
  private opacity:number;
  private fontFamily:string;
  private fontSize:number;
  private fontWeight:string;
  private fontStyle:string;
  private underline:boolean;
  private linethrough:boolean;
  private textAlign:string;
  private lineHeight:number;
  private charSpacing:number;

  // addTextToCanvas():void{
  //   this.utilService.addTextToCanvas({
  //     text:this.text,
  //     color: this.color,
  //     opacity: this.opacity,
  //     fontFamily:this.fontFamily,
  //     fontSize:this.fontSize,
  //     fontWeight:this.fontWeight,
  //     fontStyle:this.fontStyle,
  //     textAlign:this.textAlign,
  //     underline:this.underline,
  //     linethrough:this.linethrough
  //   })
  // }

  onUpdateText():void{
    if(this.selectedToolType === 'TEXT:EDITING'){
      this.utilService.onUpdateText(
        {
          color: this.color,
          opacity: this.opacity,
          fontFamily:this.fontFamily,
          fontSize:this.fontSize,
          fontWeight:this.fontWeight,
          fontStyle:this.fontStyle,
          underline:this.underline,
          linethrough:this.linethrough,
          textAlign:this.textAlign,
          lineHeight:this.lineHeight,
          charSpacing:this.charSpacing
        }
      )
    }
    else if( this.selectedToolType === 'TEXT:EDITING-ADVANCED' ){
      this.utilService.onUpdateText(
        {
          fill: this.color,
          fontFamily:this.fontFamily,
          fontSize:this.fontSize,
          fontWeight:this.fontWeight,
          fontStyle:this.fontStyle,
          underline:this.underline,
          linethrough:this.linethrough,
        }
      )
    }
  }
  
  toggleBold():void{
    this.fontWeight = this.fontWeight === 'normal'? 'bold' : 'normal';
    this.onUpdateText();
  }

  toggleItalic():void{
    this.fontStyle = this.fontStyle === 'normal'? 'italic' : 'normal';
    this.onUpdateText();
  }

  toggleUnderline():void{
    this.underline = !this.underline;
    this.onUpdateText();
  }

  toggleLinethrough():void{
    this.linethrough = !this.linethrough;
    this.onUpdateText();
  }

  setTextAlign(alignment):void{
    this.textAlign = alignment;
    this.onUpdateText();
  }

  constructor(private utilService:UtilService) { 
  }

  ngOnInit() {
    if(this.activeObjectProps && this.selectedToolType === 'TEXT:EDITING'){
      this.color = this.activeObjectProps.color;
      this.opacity = this.activeObjectProps.opacity;
      this.fontFamily = this.activeObjectProps.fontFamily;
      this.fontSize = this.activeObjectProps.fontSize;
      this.fontStyle = this.activeObjectProps.fontStyle;
      this.underline = this.activeObjectProps.underline;
      this.linethrough = this.activeObjectProps.linethrough;
      this.textAlign = this.activeObjectProps.textAlign;
      this.lineHeight = this.activeObjectProps.lineHeight;
      this.charSpacing = this.activeObjectProps.charSpacing;
    }
  }

  ngOnChanges(){
    if(this.activeObjectProps && this.selectedToolType === 'TEXT:EDITING'){
      this.color = this.activeObjectProps.color;
      this.opacity = this.activeObjectProps.opacity;
      this.fontFamily = this.activeObjectProps.fontFamily;
      this.fontWeight = this.activeObjectProps.fontWeight;
      this.fontSize = this.activeObjectProps.fontSize;
      this.fontStyle = this.activeObjectProps.fontStyle;
      this.underline = this.activeObjectProps.underline;
      this.linethrough = this.activeObjectProps.linethrough;
      this.textAlign = this.activeObjectProps.textAlign;
      this.lineHeight = this.activeObjectProps.lineHeight;
      this.charSpacing = this.activeObjectProps.charSpacing;
    }
    else if( this.selectedToolType === 'TEXT:EDITING-ADVANCED' ){
      this.color = '#ffffff';
      this.fontFamily = 'helvetica';
      this.fontSize = 24;
      this.fontWeight = 'normal';
      this.fontStyle = 'normal';
      this.underline = false;
      this.linethrough = false;
    }
  }

}
