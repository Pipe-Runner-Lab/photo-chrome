import { Component, OnInit } from '@angular/core';
import {UtilService} from '../../util.service';

@Component({
  selector: 'app-text-tools',
  templateUrl: './text-tools.component.html',
  styleUrls: ['./text-tools.component.css']
})
export class TextToolsComponent implements OnInit {

  private text:string;
  private color:string;

  addTextToCanvas():void{
    this.utilService.addTextToCanvas({
      text:this.text,
    })
  }
  
  constructor(private utilService:UtilService) { 
    this.text = ''
  }

  ngOnInit() {
  }

}
