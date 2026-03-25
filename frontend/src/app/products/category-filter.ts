import { Pipe, PipeTransform } from '@angular/core';

// This pipe is no longer used — filtering is done in the component via getProductsByCategory()
// Kept for backward compat in case any template still references it
@Pipe({ name: 'categoryFilter', standalone: true })
export class CategoryFilterPipe implements PipeTransform {
  transform(items: any[], category: string, farm: string, search: string): any[] {
    if (!items) return [];
    return items.filter(p =>
      (!category || (p.category_id as any)?.name?.toLowerCase() === category.toLowerCase()) &&
      (!farm     || (p.farmer_id as any)?._id === farm) &&
      (!search   || (p.crop_name ?? p.name ?? '').toLowerCase().includes(search.toLowerCase()))
    );
  }
}
