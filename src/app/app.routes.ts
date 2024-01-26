import { Routes } from '@angular/router';
import { CatalogComponent } from './home/pages/catalog/catalog.component';

export const routes: Routes = [
  {
    path: 'catalog',
    component: CatalogComponent,
    pathMatch: 'full',
    title: "Catalog page",
  },
  {
    path: '**',
    redirectTo: 'catalog'
  }
]
