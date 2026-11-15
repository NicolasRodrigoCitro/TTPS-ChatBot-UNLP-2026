import { HttpClient, HttpParams, HttpParameterCodec,} from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, inject, viewChild } from '@angular/core';

import { MessageHttpResponse } from '../tipos_http';
import { AlertService } from './alert-service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false,
})
export class ChatPage {
  ref = inject(ChangeDetectorRef);
  
  http = inject(HttpClient);
  alertSrv = new AlertService();
  
  mensajesChat = [
    {
      contenido: "hola",
      hora: new Date(2026, 10, 10, 3, 3, 3),
      autor: "usuario",
    },
    {
      contenido: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      hora: new Date(2026, 10, 10, 3, 3, 7),
      autor: "chatbot",
    }
  ]

  entradaUsuario = ""

  estaEnviandoMensaje: boolean = false;

  constructor() {}

  async onSubmitMensaje(event: Event, elementoAlQueScrollear: HTMLElement) {
    this.estaEnviandoMensaje = true;

    const timeout = 3000;
    const esperaResp = await this.alertSrv.mostrarCargando("esperando respuesta", timeout);
    const copiaEntradaUsuario = this.entradaUsuario;

    const onresponse = () => {
      this.estaEnviandoMensaje = false;
      esperaResp.dismiss();
    };

    this.http
      .post<MessageHttpResponse>("http://localhost:5000/api/v1/chat", 
        { message: copiaEntradaUsuario},
        { timeout },
      )
      .subscribe({
        next: (data) => {
          this.entradaUsuario = "";

          onresponse();
          
          this.onRecibioRespuestaDeMensaje(copiaEntradaUsuario, data, elementoAlQueScrollear);
        },
        error: (err) => {
          this.entradaUsuario = copiaEntradaUsuario;
          onresponse();

          console.log(err);
          if(err.status == 0) {
            let msg = 
                (err.error.name == "TimeoutError")
              ? "No pudimos procesar tu consulta en este momento"
              : "Servicio de la facultad fuera de servicio, No pudimos procesar tu consulta en este momento, haga otra consulta o intenteló mas tarde..";
            this.alertSrv.mostrarAlerta(msg, "error");
          } else if(err.status == 500) {
            this.alertSrv.mostrarAlerta("error interno del servidor", "error");
          } else {
            this.alertSrv.mostrarAlerta("error desconocido", "error");
          }

          // sin esto, tarda segundos en actualizar la pagina
          this.ref.markForCheck();
        },
      });
  }

  onRecibioRespuestaDeMensaje(
    copiaEntradaUsuario: string, 
    data: MessageHttpResponse, 
    elementoAlQueScrollear: HTMLElement,
  ) {
    this.mensajesChat = [
      ...this.mensajesChat,
      {
        contenido: copiaEntradaUsuario,
        hora: new Date(),
        autor: "usuario"
      },
      {
        contenido: data.response,
        hora: new Date(),
        autor: "chatbot"
      },
    ];

    // sin esto, tarda segundos en actualizar la pagina
    this.ref.markForCheck();

    setTimeout(() => elementoAlQueScrollear.scrollIntoView({behavior: 'smooth'}), 200);
    setTimeout(() => elementoAlQueScrollear.scrollIntoView({behavior: 'smooth'}), 500);
  }
}
