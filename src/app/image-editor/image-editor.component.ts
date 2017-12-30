import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { UtilService } from './util.service';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.css']
})
export class ImageEditorComponent implements OnInit {
  // ------------------------------- subscribtion ------------------------------
  private openSnackBarSubscription:Subscription;
  
  constructor( private utilService: UtilService, private snackBar: MatSnackBar ) { 
    this.openSnackBarSubscription = utilService.openSnackBar$.subscribe(
      (({message,duration})=>{
        this.snackBar.open(message,undefined,{
          duration: duration
        });
      })
    );
  }

  ngOnInit() { }

  ngOnDestroy(){
    this.openSnackBarSubscription.unsubscribe();
  }

}
