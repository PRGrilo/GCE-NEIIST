import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import {StudentService} from "../../services/student.service";
import { Subscription } from 'rxjs/Subscription';
import { AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-gce-hash-code',
  templateUrl: './gce-hash-code.component.html',
  styleUrls: ['./gce-hash-code.component.css']
})
export class GceHashCodeComponent implements OnInit {
    user:any;
  teamCaptain: string;
  teamContactPhone: string;
  teamContactEmail: string;
  teamName: string;
  participantsNumber: number = 1;

  acceptedTerms:boolean = false;
  acceptedPolicy:boolean = false;
  shuttle:boolean = false;
  newsletter:boolean = false;
  private subscriptions: Array<Subscription> = [];
    public numeroPessoas: Array<{ text: string, value: number }> = [
        { text: "Duas", value: 2 },
        { text: "Três", value: 3 },
        { text: "Quatro", value: 4 }
    ];


  constructor(private validateService: ValidateService,
              private flashMessage: FlashMessagesService,
              private studentService: StudentService,
              private router: Router,
              private authService: AuthService
  ) {}

  ngOnInit() {
      this.user = this.authService.loadUserProfile();
  }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();

        });
    }

  clicked() {
    this.acceptedTerms = true;
  }

  clickedp() {
    this.acceptedPolicy = true;
  }

  clickedc() {
    this.newsletter = true;
  }

    private setNumber(event,number) {
      this.participantsNumber = number;
      event.path[3].firstElementChild.innerHTML = number + " <span class=\"caret\"></span>";
    }

  addPreSign() {
    //The proposal reference is no longer company's ID, but it's name
    //const companyId = this.company.id;

    let signup = {
      teamName: this.teamName,
      teamCaptain: this.teamCaptain,
      teamContactEmail: this.teamContactEmail,
      teamContactPhone: this.teamContactPhone,
      shuttle: this.shuttle,
      newsletter: this.newsletter,
      participantsNumber: this.participantsNumber
    };


    if (!this.validateService.validateTeamName(signup.teamName))  {
      this.flashMessage.show('Introduz o nome da equipa. Este não deve superar 30 caracteres', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    if (!this.validateService.validateCaptainName(signup.teamCaptain,))  {
      this.flashMessage.show('Introduz o teu primeiro e último nome.', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    if (!this.validateService.validateTeamContact(signup.teamContactEmail))  {
      this.flashMessage.show('Introduz um e-mail válido, por favor.', {cssClass: 'alert-danger', timeout: 5000});
      return false;
    }
      if (this.participantsNumber < 2) {
          this.flashMessage.show("Introduz o número de membros da equipa", {cssClass: 'alert-danger', timeout: 3000});
          return false;
      }

    if (!this.acceptedTerms) {
      this.flashMessage.show("Tem de aceitar os termos antes de proceder", {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    if (!this.acceptedPolicy) {
      this.flashMessage.show("Tem de aceitar a Política de Privacidade antes de proceder", {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

      this.subscriptions.push(this.studentService.signup(signup).subscribe(data => {
      if (data.succeeded) {
        this.flashMessage.show(data.message, {cssClass: 'alert-success', timeout: 1000});
        this.router.navigate(['/', 'next-steps']);
      } else {
        this.flashMessage.show(data.message, {cssClass: 'alert-danger', timeout: 1000});

      }
    }));
  }

}
