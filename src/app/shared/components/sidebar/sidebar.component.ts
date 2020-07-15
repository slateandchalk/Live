import { Component, OnInit } from '@angular/core';
import { AccessService } from 'src/app/services/access.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public access: AccessService) { }

  ngOnInit() {
  }

}
