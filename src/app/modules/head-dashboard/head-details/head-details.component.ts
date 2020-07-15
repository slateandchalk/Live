import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-head-details',
  templateUrl: './head-details.component.html',
  styleUrls: ['./head-details.component.css']
})
export class HeadDetailsComponent implements OnInit {

  createForm: FormGroup;


  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<HeadDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.createForm = this.fb.group({
      eventHead: [{value: this.data.eventCategory, disabled: true}],
      eventName: [{value: this.data.eventName, disabled: true}],
      eventType: [{value: this.data.eventType, disabled: true}],
      eventFrom: [{value: this.data.eventFrom, disabled: true}],
      eventTo: [{value: this.data.eventTo, disabled: true}],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
