import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {CommentsType} from "../../../types/comments.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ActionForComment} from "../../../types/action-for-comment";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }


  getComments(article: string, offset: number): Observable<CommentsType> {
    return this.http.get<CommentsType>(environment.api + 'comments', {
      params: {
        article,
        offset
      }
    });
  }

  addComment(article: string, text: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
        article, text
    })
  }

  applyAction(id: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', {
      action: action
    })
  }

  getActionsForComment(id: string): Observable<ActionForComment[] | DefaultResponseType> {
    return this.http.get<ActionForComment[] | DefaultResponseType>(environment.api + 'comments/' + id + '/actions')
  }

  getArticleCommentActionsForUser(articleId: string): Observable<ActionForComment[] | DefaultResponseType> {
    return this.http.get<ActionForComment[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions?articleId=' + articleId)
  }
}
