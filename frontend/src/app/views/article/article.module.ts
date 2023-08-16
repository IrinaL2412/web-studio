import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { ArticleRoutingModule } from './article-routing.module';
import { BlogComponent } from './blog/blog.component';
import { DetailComponent } from './detail/detail.component';
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    BlogComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ArticleRoutingModule
  ],
  providers: [
    {provide: DatePipe}
  ]
})
export class ArticleModule { }
