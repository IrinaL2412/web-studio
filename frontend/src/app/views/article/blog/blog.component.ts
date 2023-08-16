import {Component, HostListener, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {ArticlesType} from "../../../../types/articles.type";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryType} from "../../../../types/category.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
// import {debounceTime} from "rxjs";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  constructor(private articleService: ArticleService, private categoryService: CategoryService,
              private router: Router, private activatedRoute: ActivatedRoute) {
  }

  articles: ArticleType[] = [];
  categories: CategoryType[] = [];
  filterOpen: boolean = false;
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];
  pages: number[] = [];

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe((data: CategoryType[]) => {
        this.categories = data;

        this.activatedRoute.queryParams
          // .pipe(
          //   debounceTime(500)
          // )
          .subscribe(params => {
          this.activeParams = ActiveParamsUtil.processParams(params);

          this.appliedFilters = [];

          this.activeParams.categories.forEach(url => {
            const foundCategory = this.categories.find(item => item.url === url);
            if (foundCategory) {
              this.appliedFilters.push({
                name: foundCategory.name,
                urlParam: foundCategory.url
              });
            }
          });

          this.articleService.getArticles(this.activeParams)
            .subscribe((data: ArticlesType) => {
              this.pages = [];
              for (let i: number = 1; i <= data.pages; i++) {
                this.pages.push(i);
              }

              this.articles = data.items;
            });

        });
      });
  }

  toggleFilter(): void {
    this.filterOpen = !this.filterOpen;
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const filterElement: Element | null = document.querySelector('.blog-filter');
    if (filterElement && !filterElement.contains(event.target as Node)) {
      this.filterOpen = false;
    }
  }

  isActive(url: string): boolean {
    return this.activeParams.categories.includes(url);
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType): void {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);

    this.activeParams.page = 1;

    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  updateFilterParam(url: string): void {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryInParams = this.activeParams.categories.find(item => item === url);

      if (existingCategoryInParams) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else {
        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else {
      this.activeParams.categories = [url];
    }

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });

    this.filterOpen = !this.filterOpen;
  }

  openPage(page: number): void {
    this.activeParams.page = page;

    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;

      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;

      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }
}
