import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavContent } from '@angular/material/sidenav';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { TestNavBarComponent } from './test-nav-bar';

@Component({
  selector: 'app-mat-sidenav',
  standalone: true,
  imports: [
    AngularMaterialModule,
    MatSidenavModule,
    MatSidenavContainer,
    RouterOutlet,
    MatSidenav,
    MatSidenavContent,
    SideNavbarComponent,
    TestNavBarComponent,
  ],
  templateUrl: './mat-sidenav.component.html',
  //styleUrl: './mat-sidenav.component.css'
  styles: [
    `
      .content-container {
        min-height: 100vh;
        box-sizing: border-box;
        padding: 25px;
      }
    `,
  ],
})
export class MatSidenavComponent {
  @Input() isExpanded: boolean = false;
  @Output() toggleMenu = new EventEmitter();

  public routeLinks = [
    { link: 'about', name: 'About', icon: 'dashboard' },
    { link: 'locations', name: 'Locations', icon: 'account_balance' },
  ];
}
