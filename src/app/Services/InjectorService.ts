import { Observable } from 'rxjs';
import { PaginationAPIModel } from '../Models/ApiResult';

export abstract class InjectorService<T> {
  abstract getEntries(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<PaginationAPIModel<T>>;

  abstract updateEntry(entry: T): Observable<any>;
  abstract addEntry(entry: T): Observable<any>;
  abstract deleteEntry(entry: T): Observable<any>;
}

export abstract class DuplicateValidationInjectorService<T> {
  abstract isDuplicate(code: string, extra?: string): Observable<boolean>;
}

export abstract class GetDuplicateModelValidationInjectorService<T> {
  abstract getDuplicates(
    first_value: string,
    second_value?: string
  ): Observable<any>;
}
