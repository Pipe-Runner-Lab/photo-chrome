import { Component, OnInit, Input } from '@angular/core';
import {UtilService} from '../../util.service';

@Component({
  selector: 'app-main-tools',
  templateUrl: './main-tools.component.html',
  styleUrls: ['./main-tools.component.css']
})
export class MainToolsComponent implements OnInit {

  @Input() selectedToolType;

  onChangeToolType(toolType:string):void{
    this.utilService.changeToolType(toolType,{});
  }

  canvasCommand(toolType:string):void{
    this.utilService.canvasCommand(toolType);
  }

  constructor(private utilService: UtilService) { }

  ngOnInit() {
  }

}
