import { Component, OnInit } from '@angular/core';
import {UtilService} from '../util.service'
import { Subscription }   from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  
  private selectedToolTypeList:string[] = [
    'MAIN',
    'TEXT',
    'TEXT:EDITING',
    'CROP',
    'PREVIEW',
    'FILTER'
  ];
  private selectedToolType:string;
  private activeObjectSettings:any;

  // ---------------------------- Subscription ------------------------------
  private onChangeToolTypeSubscription:Subscription;

  onChangeToolType(toolType:string):void {
    this.selectedToolType = toolType;
    // clear other values here
  }

  constructor(private utilService:UtilService) {
      this.selectedToolType = this.selectedToolTypeList[0];
      this.onChangeToolTypeSubscription = utilService.changeToolType$.subscribe(
        ({toolType,activeObjectSettings})=>{
          if(activeObjectSettings){
              console.log(activeObjectSettings);
              this.activeObjectSettings = activeObjectSettings;
          }
          this.onChangeToolType(toolType);
        }
      )
   }

  ngOnInit() {
  }

}
