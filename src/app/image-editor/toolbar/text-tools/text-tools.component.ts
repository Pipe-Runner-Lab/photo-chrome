import { Component, OnInit, Input } from '@angular/core';
import {UtilService} from '../../util.service';

@Component({
  selector: 'app-text-tools',
  templateUrl: './text-tools.component.html',
  styleUrls: ['./text-tools.component.css']
})
export class TextToolsComponent implements OnInit {

  @Input() selectedToolType;
  @Input() activeObjectSettings;

  private text:string;
  private color:string;
  private fontFamily:string;
  private fontSize:number;
  private fontWeight:string;
  private fontStyle:string;
  private underline:boolean;
  private linethrough:boolean;

  addTextToCanvas():void{
    this.utilService.addTextToCanvas({
      text:this.text,
      color: this.color,
      fontFamily:this.fontFamily,
      fontSize:this.fontSize,
      fontWeight:this.fontWeight,
      fontStyle:this.fontStyle,
      underline:this.underline,
      linethrough:this.linethrough
    })
  }

  onUpdateText():void{
    this.utilService.onUpdateText(
      {
        color: this.color,
        fontFamily:this.fontFamily,
        fontSize:this.fontSize,
        fontWeight:this.fontWeight,
        fontStyle:this.fontStyle,
        underline:this.underline,
        linethrough:this.linethrough
      }
    )
  }
  
  toggleBold():void{
    this.fontWeight = this.fontWeight === 'normal'? 'bold' : 'normal';
  }

  toggleItalic():void{
    this.fontStyle = this.fontStyle === 'normal'? 'italic' : 'normal';
  }

  toggleUnderline():void{
    this.underline = !this.underline;
  }

  toggleLinethrough():void{
    this.linethrough = !this.linethrough;
  }

  constructor(private utilService:UtilService) { 
    this.text = 'Sample Text';
    this.color = '#ffffff';
    this.fontFamily = 'helvetica';
    this.fontSize = 24;
    this.fontWeight = 'normal';
    this.fontStyle = 'normal';
    this.underline = false;
    this.linethrough = false;
  }

  ngOnInit() {
    if(this.activeObjectSettings){
      this.text = '';
      this.color = this.activeObjectSettings.color;
      this.fontFamily = this.activeObjectSettings.fontFamily;
      this.fontSize = this.activeObjectSettings.fontSize;
      this.fontStyle = this.activeObjectSettings.fontStyle;
      this.underline = this.activeObjectSettings.underline;
      this.linethrough = this.activeObjectSettings.linethrough;
    }
  }

}
