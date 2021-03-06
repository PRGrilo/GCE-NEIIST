import { Component, OnInit, TemplateRef  } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {ValidateService} from '../../services/validate.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {FeedbackService} from '../../services/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  public max:number = 5;
  public rate:number = null;
  public isReadonly:boolean = false;
  public entity:string;
  public overStar:number;
  public percent:number;
  public modalRef: BsModalRef;
  public name:string;
  public email:string;
  public message:string;
  public type:string;

  constructor(private modalService: BsModalService,
              private validateService: ValidateService,
              private flashMessage: FlashMessagesService,
              private feedbackService: FeedbackService) { }

  ngOnInit() {
  }

  public hoveringOver(value:number):void {
    this.overStar = value;
    this.percent = 100 * (value / this.max);
  };

  public resetStar():void {
    this.overStar = void 0;
  }

  public openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template);
  }

  //FIXME Doesn't work in Firefox
  private setEntity(event,entity) {
    event.path[3].firstElementChild.innerHTML = entity + " <span class=\"caret\"></span>";
    this.entity = entity;
  }

  clearFeedbackForm() {
    this.name = null;
    this.email = null;
    this.message = null;
    this.entity = null;
    this.type = null;
  }

  sendFeedback() {

    const feedback = {
      name: this.name,
      email: this.email,
      message: this.message,
      rate: this.rate,
      entity: this.entity,
      type: this.type
    };

    if (!this.validateService.validateFeedback(feedback))  {
      this.flashMessage.show("Por favor, preencha o número de estrelas e e-mail", {cssClass: 'alert-danger', timeout: 2500});
      return false;
    }

      if (!this.validateService.validateTeamContact(this.email))  {
          this.flashMessage.show('Introduz um e-mail válido, por favor.', {cssClass: 'alert-danger', timeout: 1500});
          return false;
      }

    this.feedbackService.sendFeedback(feedback).subscribe(data => {
      if (data.succeeded) {
        this.modalRef.hide();
        this.clearFeedbackForm();
        this.flashMessage.show("Feedback enviado com sucesso", {cssClass: 'alert-success', timeout: 3000});
      } else {
        this.flashMessage.show("Feedback não enviado. Contacte a administração", {cssClass: 'alert-danger', timeout: 3000});

      }
    });


  }
}
