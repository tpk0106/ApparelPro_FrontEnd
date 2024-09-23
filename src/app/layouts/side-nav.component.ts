import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavContent } from '@angular/material/sidenav';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { TestNavBarComponent } from './test-nav-bar';
import { MatIcon } from '@angular/material/icon';
import { MatList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { NgFor, NgIf } from '@angular/common';

import { navbarData } from '../misc/nav-data';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatSidenavContainer,
    RouterOutlet,
    MatSidenav,
    MatSidenavContent,
    SideNavbarComponent,
    TestNavBarComponent,
    MatIcon,
    MatList,
    RouterLink,
    MatTooltip,
    NgIf,
    NgFor,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent {
  displayRef($event: MouseEvent, arg1: string) {
    throw new Error('Method not implemented.');
  }
  clickNavbarLink($event: MouseEvent) {
    throw new Error('Method not implemented.');
  }
  @Input() isExpanded!: boolean;
  @Output() toggleMenu = new EventEmitter();
  navData: any = navbarData;
  public routeLinks: any;

  constructor() {
    console.log('inside side nav :', this.isExpanded);

    this.routeLinks = [
      { link: 'about', name: 'About', icon: 'dashboard' },
      { link: 'locations', name: 'Locations', icon: 'account_balance' },
    ];
    console.log(this.routeLinks);
  }

  // public routeLinks = [
  //   { link: 'about', name: 'About', icon: 'dashboard' },
  //   { link: 'locations', name: 'Locations', icon: 'account_balance' },
  // ];
}
