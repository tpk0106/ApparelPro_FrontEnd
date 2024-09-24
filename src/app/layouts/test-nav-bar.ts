import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { navbarData } from '../misc/nav-data';
import { RouterLink, Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { NgFor } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-testnavbar',
  standalone: true,
  imports: [
    MatMenuModule,
    AngularMaterialModule,
    RouterLink,
    HomeComponent,
    NgFor,
    MatIcon,
    MatTooltip,
  ],
  templateUrl: './test-nav-bar.component.html',
  styleUrl: './test-nav-bar.component.css',
})
export class TestNavBarComponent {
  navData: any = navbarData;
  // https://stackoverflow.com/questions/53618333/how-to-open-and-close-angular-mat-menu-on-hover
  timedOutCloser: any;
  drawer: any;
  public isExpanded = true;
  drawerClick(e: Event) {
    let ele = e.currentTarget as HTMLElement;

    console.log(ele);

    this.drawer.toggle();
    this.#sidenav.toggle();
  }
  #sidenav: any;
  constructor(private router: Router) {}

  mouseEnter(trigger: { openMenu: () => void }) {
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }
    trigger.openMenu();
  }

  mouseLeave(trigger: { closeMenu: () => void }) {
    this.timedOutCloser = setTimeout(() => {
      trigger.closeMenu();
    }, 50);
  }
  displayRef(event: MouseEvent, ele: string) {
    var e = event.currentTarget as HTMLElement;
    //console.log(e.getAttribute());
    //console.log(e.innerText);

    // var tag = 'ul' + '.' + e.innerText.toLowerCase() + '.ng-star-inserted';

    // var el = document.querySelectorAll(tag);
    // // console.log('els : ', el);
    // // console.log('els Length : ', el.length);
    // var children = el[0].children;

    // for (var i = 0; i < children.length; i++) {
    //   var element = children[i];
    //   element.setAttribute('style', 'display:block');
    // }

    // const div1 = document.querySelectorAll('ul');
    // const div2 = document.querySelectorAll('button');
    //console.log('uls : ', div1);
    //console.log('uls : ', div2);

    let buttons = null;
    let ul = null;
    switch (e.innerText) {
      case 'General':
        ul = document.querySelector('ul.general');
        break;
      case 'Order Mgt Ref':
        ul = document.querySelector('ul.ordermanagementref');
        break;
      case 'Order Management':
        ul = document.querySelector('ul.ordermanagement');
        break;
      case 'General Inventory':
        ul = document.querySelector('ul.generalinventory');
        break;
      case 'order Wise Inventory':
        ul = document.querySelector('ul.orderwiseinventory');
        break;
      case 'Production':
        ul = document.querySelector('ul.productioncontrol');
        break;
      default:
        break;
    }
    buttons = ul?.children;
    for (var i = 0; i < buttons!.length; i++) {
      var element = buttons![i];
      var att = element.getAttribute('style');

      if (att!.indexOf('display: none') < 0) {
        element.setAttribute('style', 'display: none');
      } else {
        element.setAttribute(
          'style',
          'display: block;background-color:#85c1e9;border-radius: 3px;padding-bottom:0px;color:#fff;font-weight:semibold'
        );
        element.setAttribute('class', 'plMenuCSS');
      }
    }
  }

  clickNavbarLink(event: MouseEvent) {
    var e = event.currentTarget as HTMLElement;
    //e.removeAttribute('style');
    console.log(e.getAttribute('class'));

    var att = e.getAttribute('class');
    //e.removeAttribute('style');
    //e.setAttribute('style', 'background-color:#000;color:rgb(249 115 22 / 1)');

    if (att!.indexOf('currency-table') > 0) {
      console.log('routing.....');
      e.setAttribute(
        'style',
        'background-color:#000;color:rgb(249 115 22 / 1)'
      );
      this.router.navigate(['/currency-table']);
    }
  }
}
