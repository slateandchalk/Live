import { Injectable } from '@angular/core';
import { Access } from './access.model';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { of} from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  
  access$: Observable<Access>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore, ) {
      this.access$ = this.afAuth.authState.pipe(
        switchMap(user => {
          if(user){
            return this.afs.doc<Access>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      );
    }
}
