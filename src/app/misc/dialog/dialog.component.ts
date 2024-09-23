import {
  Component,
  Inject,
  inject,
  InjectionToken,
  Input,
} from '@angular/core';
import { CountryFormComponent } from '../../references/country/country-form.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
//import { Country } from '../../Models/References/Country';
//import { ICountryService } from '../../references/country/IService';
import { CountryService } from '../../Services/countryService';
import { MatDialogActions } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { COMPONENT_TYPE } from '../paramsConfig';
import { GarmentTypeFormComponent } from '../../references/garment-type/garment-type-form.component';
import { NgIf } from '@angular/common';

// https://stackoverflow.com/questions/57977506/what-does-it-mean-inject-in-angular-component

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    CountryFormComponent,
    GarmentTypeFormComponent,
    NgIf,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  closeDialog() {
    this.dialog.closeAll();
  }
  //constructor(public matDialogRef:MatDialogRef(DialogComponent)){}

  // @Input() mydata: any;

  constructor(
    @Inject(COMPONENT_TYPE) component: any,
    private toastrService: ToastrService,
    // @Inject(ICountryService) protected service: CountryService,
    @Inject(MAT_DIALOG_DATA) public data: { entry: any },
    // @Inject(COMPONENT_TYPE) public component: any,
    //@Inject('country') public model: { entry: any },
    public matDialogRef: MatDialogRef<DialogComponent> // private matDialogRef1: MatDialogRef<CountryComponent, T> // @Inject('formcomp') comp: Component
  ) {
    this.component = component;
    console.log('Loaded comp : ', DialogComponent);

    //const com: Component = comp;
  }
  readonly dialog = inject(MatDialog);
  component!: any;
  // @Input() loadEntries!: (args: any) => void;
  // @Input() filterQuery: string = '';

  ngOnInit() {
    //console.log('ngONINIT');
  }

  editEntry(entry: any, form: any) {
    console.log('calling editentry in dialogcomponent....', entry);

    //this.dialog.open(CountryFormComponent, {
    this.dialog.open(form, {
      width: '30vw',
      position: {
        left: `${400}px`,
        top: `${window.screenY + 150}px`,
      },
      panelClass: 'shadow-effects',
      backdropClass: 'Modal__overlay',
      // height: '95vh',
      data: { country: entry },
    });
    // .afterClosed()
    // .subscribe((res) => {
    //   //this.service.(this.filterQuery)
    //   //this.loadEntries(this.filterQuery);
    //   //  this.toastrService.success(`country updated  Successfully, ${res}`);
    // });
  }
}
