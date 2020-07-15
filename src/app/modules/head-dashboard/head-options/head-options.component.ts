import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-head-options',
  templateUrl: './head-options.component.html',
  styleUrls: ['./head-options.component.css']
})
export class HeadOptionsComponent implements OnInit {

  constructor(private afs: AngularFirestore, public dialogRef: MatDialogRef<HeadOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  update(): void {
    var user = firebase.auth().currentUser;
    this.afs.doc('archive/' +  this.data.id).update({'approvedAt': this.timestamp, 'approvedBy': user.uid, 'approvedStatus': true})
    this.dialogRef.close();
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
}
