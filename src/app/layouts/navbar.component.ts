import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { navbarData } from '../misc/nav-data';
import { RouterLink, Router } from '@angular/router';
import { LoginComponent } from '../auth/login.component';
import { style } from '@angular/animations';
import { HomeComponent } from '../home/home.component';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatMenuModule,
    AngularMaterialModule,
    RouterLink,
    HomeComponent,
    NgFor,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  navData: any = navbarData;
  // https://stackoverflow.com/questions/53618333/how-to-open-and-close-angular-mat-menu-on-hover
  timedOutCloser: any;

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
      case 'Order Management1':
        ul = document.querySelector('ul.ordermanagement1');
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
        console.log('XXXXXXX', e.innerText);
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
        element.setAttribute('style', 'display: block');
      }
    }

    // switch (ele) {
    //   case 'ref':
    //     const div1 = document.querySelector('.general');
    //     var childs = div1?.children;
    //     //console.log(childs?.length);
    //     for (var i = 0; i < childs!.length; i++) {
    //       var element = childs![i];
    //       //console.log(element);
    //       var att = element.getAttribute('style');
    //       if (att!.indexOf('display:none') < 0) {
    //         element.setAttribute('style', 'display:none');
    //       } else {
    //         element.setAttribute('style', 'display:block');
    //       }
    //     }

    //     //div1!.style.display = div1?.style.display == 'block' ? 'none' : 'block';
    //     break;
    //   case 'prod':
    //     const div = document.getElementById('prod');
    //     div!.style.display = div?.style.display == 'block' ? 'none' : 'block';
    //     break;
    //   case 'ordMgt':
    //     const div2 = document.getElementById('ordMgt');
    //     div2!.style.display = div2?.style.display == 'block' ? 'none' : 'block';
    //     break;
    // }
  }

  displayRefcopy(event: MouseEvent, ele: string) {
    console.log(event.currentTarget);
    //var div = document.querySelector('div');
    //  let div = '';
    switch (ele) {
      case 'ref':
        const div1 = document.getElementById('ref');
        div1!.style.display = div1?.style.display == 'block' ? 'none' : 'block';
        break;
      case 'prod':
        const div = document.getElementById('prod');
        div!.style.display = div?.style.display == 'block' ? 'none' : 'block';
        break;
      case 'ordMgt':
        const div2 = document.getElementById('ordMgt');
        div2!.style.display = div2?.style.display == 'block' ? 'none' : 'block';
        break;
    }
  }

  clickNavbarLink(event: MouseEvent) {
    var e = event.currentTarget as HTMLElement;
    console.log(e.getAttribute('class'));

    var att = e.getAttribute('class');

    if (att!.indexOf('currency-table') > 0) {
      console.log('routing.....');

      this.router.navigate(['/currency-table']);
    }
    //  this.router.navigate(['/currency-table']);
  }
}
