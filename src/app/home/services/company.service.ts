import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, share, Subject } from 'rxjs';
import { Company } from './types.model';
@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private readonly $sharedRequest =
    this.http.get<Array<Company>>('assets/data/MOCK_DATA.json').pipe(share());
  private $categories: Subject<Array<string>> = new Subject();
  private dataLoaded = false;
  constructor(
    private http: HttpClient
  ) {
  }
  public getData(): Observable<Array<Company>> {
    if (!this.dataLoaded) {
      this.dataLoaded = true;
      this.$sharedRequest.subscribe(resp=>{
        this.$categories.next([...new Set(resp.map(person=>person.category))])
      })
    }
    return this.$sharedRequest;
  }

  public getCategories(): Observable<Array<string>> {
    return this.$categories.asObservable();
  }
}
