import {HttpClient, HttpParams, HttpParameterCodec} from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false,
})
export class ChatPage implements OnInit {
  http = inject(HttpClient);

  mensajesChat = [
    {
      contenido: "hola",
      hora: new Date(2026, 10, 10, 3, 3, 3)
    },
    {
      contenido: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      hora: new Date(2026, 10, 10, 3, 3, 7)
    }
  ]

  entradaUsuario = ""

  constructor() { }

  ngOnInit() {
  }

  onSubmitMensaje(event: Event) {
    this.mensajesChat.push({
      contenido: this.entradaUsuario,
      hora: new Date()
    })
  }
}
