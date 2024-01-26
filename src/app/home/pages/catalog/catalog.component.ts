import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Company } from '../../services/types.model';
import { debounceTime, Observable } from 'rxjs';

@Component({
  selector: 'tfec-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  public columnsTitles: { [any: string]: string } =
    {
      name: 'Company',
      category: 'Category',
      price: 'Stock Price',
      owner: 'Owner',
      public: 'Public',
      year: 'Established in',
    };
  public displayedColumns: string[] = ['name', 'category', 'price', 'owner', 'public', 'year'];

  public dataSource = new MatTableDataSource<Company>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public filterForm: FormGroup;
  public $categories: Observable<Array<string>>;

  constructor(protected companyService: CompanyService,
              private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      textSearch: [''],
      categories: [[]],
      minPrice: [1],
      maxPrice: [1000],
      public: [null]
    })

    this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe(value => this.dataSource.filter = JSON.stringify(value));
  }

  ngOnInit(): void {
    this.companyService.getData().subscribe(resp => {
      this.dataSource.data = resp;
      this.dataSource.filterPredicate = this.customFilter;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    this.$categories = this.companyService.getCategories();
  }

  private customFilter(data: Company, filter: string): boolean {
    const filteredData = JSON.parse(filter);
    const textSearch = filteredData.textSearch?.toLowerCase();
    const nameFiltering = textSearch ? data.name.toLowerCase().includes(textSearch): true;
    if (!nameFiltering) return false;
    const categoryFiltering = filteredData.categories.length ? filteredData.categories.includes(data.category) : true;
    if (!categoryFiltering) return false;
    const priceFiltering = filteredData.minPrice <= data.price && data.price <= filteredData.maxPrice;
    if (!priceFiltering) return false;
    return filteredData.public !== null ? filteredData.public === data.public : true;
  }

  public clearFilter() {
    this.filterForm.setValue({
      textSearch: '',
      categories: [],
      minPrice: 1,
      maxPrice: 1000,
      public: null
    })
  }
}
