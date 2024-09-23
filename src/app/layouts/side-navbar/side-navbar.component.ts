import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { navbarData } from '../../misc/nav-data';
import { NgFor } from '@angular/common';
//import { CurrencyComponent } from '../../references/currency/currency.component';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HomeComponent } from '../../home/home.component';

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    //  CurrencyComponent,
    NgIf,
    RouterOutlet,
    FooterComponent,
    HomeComponent,
  ],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.css',
})
export class SideNavbarComponent {
  open: boolean = true;
  showFirst: boolean = true;
  // constructor(private navBarData:  navbarData) {
  //   this.navData = navBarData;
  // }

  constructor() {}

  ngOnInit() {
    //this.myClick;
    console.log('init');
    setTimeout(() => {
      this.myClick;
      // this.open = !this.open;
    }, 10);
    //this.myClick;
  }

  navData: any = navbarData;
  LogoUrl: string = 'https://www.flaticon.com/free-icons/apparel';

  myClick($event: Event) {
    //   console.log('click', this.open);

    //console.log($event.currentTarget);
    const div = $event.currentTarget as HTMLInputElement;
    //div.style.display = this.open ? 'flex' : 'none';
    // div.style.background = this.open ? 'red' : 'yellow';
    //   div.style.marginLeft = this.open ? '200px' : '5px';
    // this.open = false;
    this.open
      ? div.classList.remove('w-[2%]')
      : div.classList.remove('w-[15%]');
    this.open ? div.classList.add('w-[15%]') : div.classList.remove('w-[2%]');

    this.open = !this.open;
    // setTimeout(() => {
    //   // this.open = !this.open;
    // }, 1000);
  }

  isOpen() {
    return this.open && 'rotate-180';
  }
  // onTextMouseLeave() {
  //   window.setTimeout(
  //     function () {
  //       this.open = false;
  //     }.bind(this),
  //     3000
  //   );
  // }
}
//https://www.concretepage.com/angular-material/angular-material-menu-routerlink
