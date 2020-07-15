import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; 
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

interface Archive{
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
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {

  archiveCollection: AngularFirestoreCollection<Archive>;
  archives: Observable<Archive[]>;

  isNodata = false;

  constructor(
    private auth:AuthService,
    private router:Router,
    private afs:AngularFirestore,
    private afAuth: AngularFireAuth
  ) {

  this.archiveCollection = this.afs.collection('archive', ref => ref.orderBy('eventId', 'asc').where('createdBy', '==', this.afAuth.auth.currentUser.uid));

  this.archives = this.archiveCollection.valueChanges();
  this.archives.subscribe(dataCheck=> {
    if (dataCheck.length == 0) {
      return this.isNodata = true;
    }
  });
   }

  ngOnInit() {
    
  }

  step;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

}
