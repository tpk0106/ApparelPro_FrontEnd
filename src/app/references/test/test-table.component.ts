import { Component, EventEmitter, Inject } from '@angular/core';
import { Country } from '../../Models/References/Country';
import { MatTableDataSource } from '@angular/material/table';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { basetable } from '../../common/basetable';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FieldComponent } from '../../utilities/field/field.component';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../misc/dialog/dialog.component';

import { InjectorService } from '../../Services/InjectorService';
import { GarmentTypeService } from '../../Services/garmentTypeService';
import { COUNTRY_SERVICE_PLUGIN } from '../../tokens/tokenConfig';
@Component({
  selector: 'app-test-table',
  standalone: true,
  //providers: [GarmentTypeService],
  //providers: [CountryService],
  imports: [
    NgFor,
    CommonModule,
    MatPaginator,
    MatTable,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    AngularMaterialModule,
    FieldComponent,
    MatRadioButton,
    ReactiveFormsModule,
  ],
  templateUrl: './test-table.component.html',
  styleUrl: './test-table.component.css',
})

// https://stackoverflow.com/questions/39224865/dependency-injection-into-abstract-class-typescriptangular2
export class TestTableComponent extends basetable<Country> {
  constructor(
    // service: CountryService,
    //@Inject(CountryService) service: CountryService,

    //@Inject(IService<country>) service: GarmentTypeService,
    @Inject(COUNTRY_SERVICE_PLUGIN) service: InjectorService<Country>,
    //  @Inject(IService<country>) service: IService<country>,
    //@Inject(IService) service: CountryService, // (Working) ************************
    //@Inject(ICountryService<Country>) service: CountryService,
    //protected override columns: string[] ,
    //  @Inject('cols') protected columns: string[]
    // @Inject(COMPONENT_TYPE) comp: CurrencyExchangeComponent,

    @Inject('defaultSortColumn') defaultSortCol: string,
    // override formComponent: Component, //
    //dialog: MatDialogRef<DialogComponent, GarmentTypeFormComponent>
    dialog: MatDialogRef<DialogComponent>
  ) {
    //super(service, defaultSortColumn, formComponent);
    //    super(service, defaultSortColumn);
    super(service, defaultSortCol);
    this.defaultSortColumn = defaultSortCol;
    // formComponent = new GarmentTypeFormComponent();
  }

  override defaultPageIndex: number = this.defaultPageIndex;
  override defaultPageSize: number = this.defaultPageSize;
  override defaultSortColumn: string = this.defaultSortColumn;

  override filterChanged: BehaviorSubject<string> = this.filterChanged;
  override entries!: MatTableDataSource<Country, MatPaginator>;
  override sort: MatSort = this.sort;
  override paginator: MatPaginator = this.paginator;
  override columnsToDisplay: string[] = ['id', 'code', 'name', 'flag'];

  countries = new MatTableDataSource<Country, MatPaginator>();

  getCountries() {
    this.service
      .getEntries(
        this.defaultPageIndex,
        this.defaultPageSize,
        this.defaultSortColumn,
        this.defaultSortOrder,
        this.defaultFilterColumn,
        this.filterQuery
      )
      .subscribe((res: { items: Country[] }) => {
        this.countries = new MatTableDataSource(res.items);
      });
  }

  ngOnInit() {
    this.loadEntries(this.filterQuery);
  }

  radioChange($event: MatRadioChange) {
    this.defaultFilterColumn = $event.value;
    this.placeholder = `filter by ${$event.value} ...`;
  }
  //override editEntry(entry: Country, component: this): void {
  override editEntry(country: Country): void {
    console.log('edit entry in test table', country);
    console.log('edit entry in test table', country.id);
    console.log('edit entry in test table', country.name);

    this.dialog
      .open(DialogComponent, { data: { country: country } })
      .afterClosed()
      .subscribe(() => {
        this.loadEntries(this.filterQuery);
        //  this.toastrService.success(`country updated  Successfully, ${res}`);
      });
  }
  // readonly dialog = inject(MatDialog);

  override addEntry(entry: Country) {}

  // editCountry(country: Country) {
  //   this.dialog
  //     .open(TestTableComponent, {
  //       width: '30vw',
  //       position: {
  //         left: `${window.screenX + window.innerWidth / 2}px`,
  //         top: `${window.screenY + 150}px`,
  //       },
  //       panelClass: 'shadow-effects',
  //       backdropClass: 'Modal__overlay',
  //       // height: '95vh',
  //       data: { country: country },
  //     })
  //     .afterClosed()
  //     .subscribe((res) => {
  //       this.loadEntries(this.filterQuery);
  //       // this.toastrService.success(`country updated  Successfully, ${res}`);
  //     });
  // }

  // @Output() EditCountry: EventEmitter<MouseEvent> = new EventEmitter();

  // public handleClick($event: MouseEvent) {
  //   //this.EditCountry(this.country, CountryFormComponent)
  //   //   new //this.EditCountry(this.country, CountryFormComponent)
  //   //this.EditCountry();
  //   console.log('click');
  //   // this.editEntry();
  // }
}
