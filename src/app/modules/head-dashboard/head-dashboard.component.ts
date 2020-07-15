import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as firebase from 'firebase/app';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {delay} from 'rxjs/operators';

import {MatDialog} from '@angular/material/dialog';
import { HeadOptionsComponent } from './head-options/head-options.component';
import { HeadDetailsComponent } from './head-details/head-details.component';

@Component({
  selector: 'app-head-dashboard',
  templateUrl: './head-dashboard.component.html',
  styleUrls: ['./head-dashboard.component.css'],
})
export class HeadDashboardComponent implements OnInit {

  isLoading = true;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = ['Pending', 'Approved'];

  displayedColumns: string[] = ['eventId', 'eventName', 'approvedStatus', 'Details', 'Options'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private afs: AngularFirestore, public dialog: MatDialog) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));

      var user = firebase.auth().currentUser;
      this.afs.collection<any>('archive', ref => ref.where('eventHead','==', user.uid)).valueChanges().pipe(delay(1000)).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        console.log(this.dataSource)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      });
   }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  add(event: MatChipInputEvent): void {

    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.fruits.push(value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.fruitCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
    var user = firebase.auth().currentUser;
    this.afs.collection<any>('archive', ref => ref.where('eventHead','==', user.uid)).valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data); 
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);

    var user = firebase.auth().currentUser;
    if(event.option.viewValue === "Pending"){
    this.afs.collection<any>('archive', ref => ref.where('eventHead','==', user.uid).where('approvedStatus', '==', false)).valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data); 
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    } else if(event.option.viewValue === "Approved"){
      this.afs.collection<any>('archive', ref => ref.where('eventHead','==', user.uid).where('approvedStatus', '==', true)).valueChanges().subscribe(data => {
        this.dataSource = new MatTableDataSource(data); 
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  permissionDialog(dataq): void {
    this.dialog.open(HeadOptionsComponent, {
      width: '600px',
      data: {
        ...dataq
      }
    });
  }

  detailsDialog(dataw): void {
    this.dialog.open(HeadDetailsComponent, {
      width: '600px',
      data: {
        ...dataw
      }
    });
  }

}
