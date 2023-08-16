import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import { ArticleCardPipe } from './pipes/article-card.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import { CommentComponent } from './components/comment/comment.component';


@NgModule({
  declarations: [
    ArticleCardComponent,
    ArticleCardPipe,
    LoaderComponent,
    CommentComponent
  ],
  exports: [
    ArticleCardComponent,
    ArticleCardPipe,
    LoaderComponent,
    CommentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class SharedModule { }
