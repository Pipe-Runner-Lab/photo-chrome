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
    'FILTER:ALL',
    'FILTER:SINGLE',
    'DEACTIVATE'
  ];
  private selectedToolType:string;
  private activeObjectProps:any;
  private selection:any;
  private selectionType:string;

  // ---------------------------- Subscription ------------------------------
  private onChangeToolTypeSubscription:Subscription;
  private onSelectionCreatedSubscription:Subscription;

  onChangeToolType(toolType:string):void {
    this.selectedToolType = toolType;
  }

  cleanSelect(){
    this.utilService.canvasCommand('CLEAN_SELECT');
    this.onChangeToolType('MAIN');
  }

  bringForward(){
    this.utilService.canvasCommand('BRING_FORWARD');
  }

  sendBackward(){
    this.utilService.canvasCommand('SEND_BACKWARD');
  }

  constructor(private utilService:UtilService) {
      this.selectedToolType = this.selectedToolTypeList[0];
      this.onChangeToolTypeSubscription = utilService.changeToolType$.subscribe(
        ({toolType,activeObjectProps})=>{
          if(activeObjectProps){
              this.activeObjectProps = activeObjectProps;
          }
          this.onChangeToolType(toolType);
        }
      )
      this.onSelectionCreatedSubscription = utilService.onSelectionCreated$.subscribe(
        ({selection,selectionType}) => {
          this.selectionType = selectionType;
          this.selection = selection;
        }
      )
   }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.onChangeToolTypeSubscription.unsubscribe();
    this.onSelectionCreatedSubscription.unsubscribe();
  }

}
