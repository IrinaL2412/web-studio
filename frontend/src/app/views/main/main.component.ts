import {Component, OnInit} from '@angular/core';
import {ArticleType} from "../../../types/article.type";
import {ArticleService} from "../../shared/services/article.service";
import {OwlOptions} from "ngx-owl-carousel-o";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ModalService} from "../../shared/services/modal.service";
import {HttpErrorResponse} from "@angular/common/http";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(private articleService: ArticleService, private fb: FormBuilder,
              private modalService: ModalService) {
  }

  articles: ArticleType[] = [];

  isShowPopupForm: boolean = false;
  isShowPopupSuccess: boolean = false;
  isResponseError: boolean = false;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false,
  }

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items: 3,
    nav: false
  }

  services = [
    {
      title: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7 500',
      image: 'services-item1.png'
    },
    {
      title: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3 500',
      image: 'services-item2.png'
    },
    {
      title: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1 000',
      image: 'services-item3.png'
    },
    {
      title: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: '750',
      image: 'services-item4.png'
    }
  ]

  reviews = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    }
  ]

  popupForm: FormGroup = this.fb.group({
    service: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.pattern('^(?:[А-ЯЁA-Z][а-яёa-z]*)$')]],
    phone: ['', [Validators.required, Validators.pattern('^\\+?\\d{1,11}$')]],
  });


  get service() {
    return this.popupForm.get('service');
  }

  get name() {
    return this.popupForm.get('name');
  }

  get phone() {
    return this.popupForm.get('phone');
  }

  ngOnInit() {
    this.articleService.getPopularArticles()
      .subscribe((data: ArticleType[]) => {
        this.articles = data;
      });
  }

  popup(): void {
    const data = {
      ...this.popupForm.value,
      type: 'order',
    }
    this.modalService.getModalOrder(data)
      .subscribe({
        next: (dataResponse: DefaultResponseType) => {
          if (!dataResponse.error) {
            this.isShowPopupForm = false;
            this.isShowPopupSuccess = true;
            this.popupForm.reset();
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error) {
            this.isResponseError = true;
          }
        }
      })
  }

  showPopupForm(service: string): void {
    this.isShowPopupForm = true;
    this.popupForm.patchValue({service: service});
  }

  hidePopupForm(): void {
    this.isShowPopupForm = false;
    this.isResponseError = false;
    this.popupForm.reset();
  }

  hidePopupSuccess(): void {
    this.isShowPopupSuccess = false;
  }
}

