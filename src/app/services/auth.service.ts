import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { of, Observable} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';

import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private snack: MatSnackBar
  ) { 
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user){
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
}

  async googleSignin(){
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    await this.router.navigate(['/']);
    return this.snack.open('See you!','Ok', {duration: 4000});
  }

  private updateUserData(user){
    const userRef: AngularFirestoreDocument<User> =this.afs.doc(`users/${user.uid}`);

    this.snack.open('Welcome back! '+ user.displayName,'Ok', {duration: 4000});
    
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    return userRef.set(data, { merge: true }).then(() => {
      this.router.navigate(['/dashboard']);
      return this.snack.open('You have been sign', 'OK', { duration: 4000 });
    });
  }

}
