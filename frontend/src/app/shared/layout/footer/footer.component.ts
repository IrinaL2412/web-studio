import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalService} from "../../services/modal.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(private fb: FormBuilder, private modalService: ModalService) {
  }

  isShowPopupForm: boolean = false;
  isShowPopupSuccess: boolean = false;
  isResponseError: boolean = false;

  popupForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('^(?:[А-ЯЁA-Z][а-яёa-z]*)$')]],
    phone: ['', [Validators.required, Validators.pattern('^\\+?\\d{1,11}$')]],
  });

  get name() {
    return this.popupForm.get('name');
  }

  get phone() {
    return this.popupForm.get('phone');
  }

  popup(): void {
    const data = {
      ...this.popupForm.value,
      type: 'consultation',
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

  showPopupForm(): void {
    this.isShowPopupForm = true;
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
