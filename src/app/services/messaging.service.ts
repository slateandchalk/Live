import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeadMessagesComponent } from '../modules/head-dashboard/head-messages/head-messages.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ClientMessagesComponent } from '../modules/client-dashboard/client-messages/client-messages.component';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private messaging = firebase.messaging()

  private messageSource = new Subject()
  currentMessage = this.messageSource.asObservable() // message observable to show in Angular component

  constructor(
    private afs: AngularFirestore,
    private snackbar: MatSnackBar,
    private bottombar: MatBottomSheet) {}
// get permission to send messages
getPermission(user) {
  this.messaging.requestPermission()
  .then(() => {
    console.log('Notification permission granted.');
    return this.messaging.getToken()
  })
  .then(token => {
    console.log(token)
    this.saveToken(user, token)
  })
  .catch((err) => {
    console.log('Unable to get permission to notify.', err);
  });
}

// Listen for token refresh
monitorRefresh(user) {
  this.messaging.onTokenRefresh(() => {
    this.messaging.getToken()
    .then(refreshedToken => {
      console.log('Token refreshed.');
      this.saveToken(user, refreshedToken)
    })
    .catch( err => console.log(err, 'Unable to retrieve new token') )
  });
}

// used to show message when app is open
receiveMessages() {
  this.messaging.onMessage(payload => {
   console.log('Message received. ', payload);
   this.messageSource.next(payload);
   if(payload.notification.approvedStatus){
    this.bottombar.open(ClientMessagesComponent, {
      data: payload
     });
   } else {
    this.bottombar.open(HeadMessagesComponent, {
      data: payload
    });
   }
 });
}

// save the permission token in firestore
private saveToken(user, token): void {
  
    const currentTokens = user.fcmTokens || { }
    console.log(currentTokens, token)

    // If token does not exist in firestore, update db
    if (!currentTokens[token]) {
      const userRef = this.afs.collection('users').doc(user.uid)
      const tokens = { ...currentTokens, [token]: true }
      userRef.update({ fcmTokens: tokens })
    }
}
}