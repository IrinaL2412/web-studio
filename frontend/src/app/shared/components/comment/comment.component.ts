import {Component, Input, OnInit} from '@angular/core';
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ActionForComment} from "../../../../types/action-for-comment";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../services/comment.service";
import {ArticleType} from "../../../../types/article.type";
import {CommentType} from "../../../../types/comment.type";
import {HttpErrorResponse} from "@angular/common/http";
import {HotToastService} from "@ngneat/hot-toast";
import {UserActionsType} from "../../../../types/user-actions.type";


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  constructor(private authService: AuthService, private commentService: CommentService, private toastService: HotToastService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  @Input() articleComment!: CommentType;
  article!: ArticleType;
  isLogged: boolean = false;
  isActiveLike: boolean = false;
  isActiveDislike: boolean = false;
  actionBefore: string = '';
  like: string = UserActionsType.like;
  dislike: string = UserActionsType.dislike;
  violate: string = UserActionsType.violate;


  ngOnInit() {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    if (this.isLogged) {
      this.commentService.getActionsForComment(this.articleComment.id)
        .subscribe((data: DefaultResponseType | ActionForComment[]) => {
          const actionsForComment = data as ActionForComment[];
          actionsForComment.forEach(item => {
            if (item.comment === this.articleComment.id) {
              if (item.action === this.like) {
                this.isActiveLike = true;
                this.actionBefore = item.action;
              }

              if (item.action === this.dislike) {
                this.isActiveDislike = true;
                this.actionBefore = item.action;
              }
            }
          });
        });
    }
  }

  handleAction(commentId: string, action: string) {
    if (this.isLogged) {
      this.commentService.applyAction(commentId, action)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (!data.error) {

              if (action === this.like && this.actionBefore === this.like) {
                this.toastService.success('Ваш голос учтен');
                this.isActiveDislike = false;
                this.actionBefore = '';
                this.articleComment.likesCount--;
                this.isActiveLike = !this.isActiveLike;
                return;
              }

              if (action === this.like && this.actionBefore === this.dislike) {
                this.toastService.success('Ваш голос учтен');
                this.isActiveDislike = false;
                this.actionBefore = this.like;
                this.articleComment.likesCount++;
                this.articleComment.dislikesCount--;
                this.isActiveLike = !this.isActiveLike;
                return;
              }

              if (action === this.like && this.actionBefore === '') {
                this.toastService.success('Ваш голос учтен');
                this.isActiveDislike = false;
                this.actionBefore = this.like;
                this.articleComment.likesCount++;
                this.isActiveLike = !this.isActiveLike;
                return;
              }

              if (action === this.dislike && this.actionBefore === this.dislike) {
                this.toastService.success('Ваш голос учтен');
                this.isActiveLike = false;
                this.articleComment.dislikesCount--;
                this.isActiveDislike = !this.isActiveDislike;
                this.actionBefore = '';
                return;
              }

              if (action === this.dislike && this.actionBefore === this.like) {
                this.toastService.success('Ваш голос учтен');
                this.isActiveLike = false;
                this.articleComment.dislikesCount++;
                this.articleComment.likesCount--;
                this.isActiveDislike = !this.isActiveDislike;
                this.actionBefore = this.dislike;
                return;
              }

              if (action === this.dislike && this.actionBefore === '') {
                this.toastService.success('Ваш голос учтен');
                this.isActiveLike = false;
                this.articleComment.dislikesCount++;
                this.isActiveDislike = !this.isActiveDislike;
                this.actionBefore = this.dislike;
                return;
              }

              if (action === this.violate) {
                this.toastService.warning('Жалоба отправлена');
              }
            } else {
              this.toastService.error('Произошла ошибка при обработке вашего голоса');
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.toastService.warning('Жалоба уже отправлена');
            }
          }
        });
    } else {
      this.toastService.warning('Действие доступно только для авторизованных пользователей');
    }
  }
}
