import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

interface Head {
  eventId: string;
  eventCategory: string;
  eventHead: string;
  eventName: string;
  eventType: string;
  eventFrom: string;
  eventTo: string;
  createdAt: string;
  createdBy: string;
  approvedStatus: boolean;
  approvedAt: string
  approvedBy: string;
  verifiedStatus: boolean;
  verifiedAt: string;
  verifiedBy: string;
  emailStatus: boolean,
  emailAt: string;
  count: number;
}

@Component({
  selector: 'app-create-dashboard',
  templateUrl: './create-dashboard.component.html',
  styleUrls: ['./create-dashboard.component.css']
})
export class CreateDashboardComponent implements OnInit {
  today: number = Date.now();

  createForm: FormGroup;

  selectHead: string;

  headsCol: AngularFirestoreCollection<Head>;
  heads: Observable<Head[]>;
 
  constructor(
    public auth:AuthService,
    private router:Router,
    private afs:AngularFirestore,
    private fb: FormBuilder) { 
    setInterval(() => {this.today = Date.now()}, 1);
  }

  ngOnInit() {

    this.headsCol = this.afs.collection('heads');
    this.heads = this.headsCol.valueChanges();

    this.createForm = this.fb.group({
      eventHead: ['', Validators.required],
      eventName: ['', Validators.required],
      eventType: ['', Validators.required],
      eventFrom: ['', Validators.required],
      eventTo: ['', Validators.required],
    });
  }

  get eventName(){
    return this.createForm.get('eventName')
  }

  get eventType(){
    return this.createForm.get('eventType')
  }

  get eventFrom(){
    return this.createForm.get('eventFrom')
  }

  get eventTo(){
    return this.createForm.get('eventTo')
  }

  onSubmit(headx) {
    var countx = headx.count+1;
    var datex = this.eventFrom.value.split("T");
    var datey = datex[0].split("-");
    var datez = datex[1].split(":");
    var countz = headx.initial+datey[0]+datey[1]+datey[2]+this.eventType.value+countx;
    var user = firebase.auth().currentUser;
    this.afs.collection('heads', ref => ref.where('initial', '==', headx.initial)).get().subscribe(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        doc.ref.update({'count': countx});
      });
    });
    
    this.afs.collection('archive')
    .add({
      'eventId': countz,
      'eventCategory': headx.eventCategory,
      'eventHead': headx.uid,
      'eventName': this.eventName.value,
      'eventType': this.eventType.value,
      'eventFrom': this.eventFrom.value,
      'eventTo': this.eventTo.value, 
      'createdAt': this.timestamp,
      'createdBy': user.uid,
      'approvedStatus': false,
      'approvedAt':'',
      'approvedBy':'',
      'verifiedStatus': false,
      'verifiedAt':'',
      'verifiedBy':'',
      'emailStatus': false,
      'emailAt':''})
    .then(function(documentRef) {
        var documentId = documentRef.id;
        console.log(documentId);
        documentRef.update({'id': documentId});
      });

      this.router.navigate(['/dashboard']);
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
}