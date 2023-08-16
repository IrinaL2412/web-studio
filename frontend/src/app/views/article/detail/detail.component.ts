import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment.development";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../../shared/services/comment.service";
import {FormControl} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentsType} from "../../../../types/comments.type";
import {CommentType} from "../../../../types/comment.type";
import {HotToastService} from "@ngneat/hot-toast";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  constructor(private authService: AuthService, private articleService: ArticleService, private activatedRoute: ActivatedRoute,
              private commentService: CommentService, private toastService: HotToastService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  article!: ArticleType;
  relatedArticles: ArticleType[] = [];
  isLogged: boolean = false;
  commentsQuantity: number = 3;
  showLoadMoreCommentsButton: boolean = false;
  serverStaticPath: string = environment.serverStaticPath;

  commentValue: FormControl = new FormControl('');

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });


    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          this.article = data;
          this.commentsQuantity = data.comments.length;

          if (this.article.commentsCount > 3) {
            this.showLoadMoreCommentsButton = true;
          }

          this.articleService.getRelatedArticles(params['url'])
            .subscribe((data: ArticleType[]) => {
              this.relatedArticles = data;
            });
        })
    });
  }


  addComment(): void {
    this.commentService.addComment(this.article.id, this.commentValue.value)
      .subscribe((data: DefaultResponseType) => {
        if (!data.error) {
          this.toastService.success(data.message);
          this.commentValue.setValue('');

          this.articleService.getArticle(this.article.url)
            .subscribe((data: ArticleType) => {
              this.article = data;

              this.commentsQuantity = this.article.comments.length;

              if (this.article.commentsCount > 3) {
                this.showLoadMoreCommentsButton = true;
              }
            });
        } else {
          const error: string = data.message;
          throw new Error(error);
        }
      })
  }

  shoeMoreComments(): void {
    this.commentService.getComments(this.article.id, this.commentsQuantity)
      .subscribe((data: CommentsType) => {
        data.comments.forEach((comment: CommentType) => {
          this.article.comments.push(comment);
        });

        this.commentsQuantity = this.article.comments.length;
        this.showLoadMoreCommentsButton = data.allCount - this.commentsQuantity > 0;

      });
  }
}
