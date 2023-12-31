import {Component, Input} from '@angular/core';
import {environment} from "../../../../environments/environment.development";
import {ArticleType} from "../../../../types/article.type";

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input() article!: ArticleType;
  serverStaticPath: string = environment.serverStaticPath;
}
