
import { CustomDatePipe } from './../../pipes/customDate.pipe';
import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { LlmModelIaService } from 'src/app/core/http/llm-model-ia.service';
import { Conversation, Message } from '../../models/interfaces/Chatbot.interface';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ChatbotButtonsComponent } from './chatbot-components/chatbot-buttons/chatbot-buttons.component';
import { ChatbotServiceService } from './chatbot-services/chatbot-service.service';
import { newDialogOverviewExample } from './chatbot-components/new-chat-button/new-chat-button.component';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from './chatbot-components/delete-confirmation/delete-confirmation.component';
import { DialogOverviewExampleDialog } from './chatbot-components/save-button/save-button.component';
import {ClipboardModule} from '@angular/cdk/clipboard';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, FormsModule, ResizableModule, ChatbotButtonsComponent, newDialogOverviewExample, MatTooltipModule,ClipboardModule],
  providers: [CustomDatePipe, ChatbotServiceService]
})

export class ChatbotComponent implements OnInit, AfterViewChecked {
  //NODOS HTML DEL DOM QUE NECESITAMOS
  @ViewChild('messagesContainer', { static: false }) messageContainer!: ElementRef;
  @ViewChild('textArea', { static: false }) textArea!: ElementRef;
  @ViewChild('resizableContainer', { static: false }) resizableContainer!: ElementRef;


  //FUNCION PARA EL RESIZE DEL CHATBOT
  onResizeEnd(event: ResizeEvent): void {
    //console.log('Element was resized', event);
    this.resizableContainer.nativeElement.style.height = event.rectangle.height + 'px';
    this.resizableContainer.nativeElement.style.width = event.rectangle.width + 'px';
  }

  //COMPRUEBA LA VISTA DESPUES DE CAMBIOS
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  // FUNCION PARA HACER SCROLL HASTA BOTTOM
  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (error) {
      //console.log(error);
    }
  }

  //VARIABLES DE CLASE
  messages: Message[] = [];
  userMessage = '';
  userBol: boolean = true;
  botMessageText = '';
  botMessage: boolean = false;
  count: number = 0;
  chatbotVisible = false;
  expanded = true;
  date = new Date();
  time = '';
  messageToSave: string = '';
  activeBtn: boolean = true;
  activeArea: boolean = false;
  responseLoaded: boolean = false;
  fullConversation: Conversation = { user: '', date: '', title: '', conversation: [] };
  conversationsNumber: number = 0;
  initialMessage: Message = { type: '', text: '', time: '' };
  private stopRequest$ = new Subject<void>();
  conversations: any = {};
  workingDate: any;
  miSuscripcion: any;
  title: string | undefined;


  // CONSTRUCTOR
  constructor(private llmModelIaService: LlmModelIaService, private authService: AuthService, private http: HttpClient, private chatbotService: ChatbotServiceService, public dialog: MatDialog) {
    this.fullConversation = this.chatbotService.fullConversation;

  }



  ngOnInit() {
    // GET DE CONVERSACIONES DEL USUARIO Y ACTIVA LA SUBSCRIPCION DEL SIGUIENTE BLOQUE DE CODIGO
    this.conversationsUser();
    // SUBSCRIPCIÓN A DATA$ QUE ES OBSERVABLE QUE USAMOS PARA RENDERIZAR CUANDO HAY CAMBIOS
    this.chatbotService.data$.subscribe({
      next: () => {
        this.fullConversation = this.chatbotService.fullConversation;
        this.messages = this.fullConversation.conversation;

        // SETEA FULLCONVERSATION Y MENSAJE INICIAL
        this.chatbotService.fullConversation.user = this.authService.getUsername();
        this.chatbotService.fullConversation.date = this.actualTime();

        let userFirstname = this.chatbotService.fullConversation.user.split('.')[0]
        userFirstname = userFirstname.charAt(0).toUpperCase() + userFirstname.slice(1);
        this.initialMessage = { type: 'bot', text: `¡Hola! ¿En qué puedo ayudarte ${userFirstname} ?  `, time: this.chatbotService.fullConversation.date };

        this.messages.push(this.initialMessage);
        this.time = this.actualTime();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  activeSendBtn() {
    // DESDE EVENTO INPUT DE TEXTAREA ACTIVA O DESACTIVA EL BOTON DE ENVIAR Y ALTURA DEL TEXTAREA
    this.userMessage.length > 1 ? this.activeBtn = false : this.activeBtn = true;
    this.userMessage.length == 0 ? this.initTextArea() : null;

    let txtAreaHeigth = this.textArea.nativeElement.scrollHeight;
    txtAreaHeigth > 250 ? txtAreaHeigth = 250 : txtAreaHeigth;
    txtAreaHeigth < 50 ? txtAreaHeigth = 50 : txtAreaHeigth;
    //ASIGNAR VALOR DE HEIGTH A TEXTAREA
    this.textArea.nativeElement.style.height = txtAreaHeigth + 'px';

    this.botMessage

  }

  changeButton() {
    // CAMBIA EL BOTON DE ENVIAR MENSAJE A PARAR Y VICEVERSA
    this.botMessage = !this.botMessage;
  }

  sendMessage() {
    // ACCIONES DE CAMBIO DE ESTILOS (MOSTRAR SPINNER, BORRAR TEXTO USUARIO, ...)
    this.messages.push({ type: 'user', text: this.userMessage, time: this.actualTime() });
    this.messages.push({ type: 'bot', text: this.botMessageText, time: this.actualTime() });
    this.changeButton();
    this.responseLoaded = true;
    this.userMessage = '';
    this.activeSendBtn();
    this.activeArea = true;

    // ENVIO DEL MENSAJE A API DE PYTHON
    this.miSuscripcion = this.llmModelIaService.getProjectAssistantResponse(this.messages[this.messages.length - 2].text, this.stopRequest$).subscribe({
      next: (chunk) => { // Esto es cada vez que llega un trozo de la respuesta
        this.messages[this.messages.length - 1]['text'] += chunk; // Actualizamos el ultimo mensaje del bot añadiendole el ultimo trozo
      },
      error: (error) => { // Si sale un error durante la peticion
        this.responseLoaded = false;
        this.initTextArea();
        this.activeBtn = true;
        this.activeArea = false;
        this.changeButton();
        console.log(error);


      },
      complete: () => {// Esto es una vez llega el ultimo trozo de la respuesta
        //console.log('complete');
        this.responseLoaded = false;
        this.initTextArea();
        this.changeButton();
        this.count++;
        this.activeBtn = true;
        this.activeArea = false;
        this.chatbotService.fullConversation.conversation = this.messages;
        //FULLCONVERSATION ES OBJETO A GUARDAR EN BBDD
        //console.log(this.chatbotService.fullConversation);
      }

    });
  }

  cutConexion() {
    // CORTA LA CONEXION CON EL SERVIDOR DE IA
    if (this.miSuscripcion) {
      // CAMBIA VALOR DE OBSERVABLE STOPREQUEST$ PARA DETENER LA LLAMADA A LA API
      this.stopRequest$.next(); // Emite un valor en stopRequest$ para detener la llamada a la API
    }
    this.activeBtn = true;
    this.activeArea = false;
    this.chatbotService.fullConversation.conversation = this.messages;

  }

  initTextArea() {
    this.textArea.nativeElement.style.height = '50px';
  }

  toggleChatbot() {
    this.chatbotVisible = !this.chatbotVisible;
  }

  // EXPANDE EL CHATBOT. QUEDA EN DESUSO POR IMPLEMENTACION DE RESIZE
  expandChatbot() {
    this.expanded = !this.expanded;
    const chatbotContainer = document.querySelector('.chatbot-container');
    chatbotContainer?.removeAttribute('style');
    chatbotContainer!.classList.toggle('expanded');
  }
  // FUNCION QUE DEVUELVE HORA Y FECHA EN FORMATO ADECUADO
  actualTime() {
    let actualTime = format(new Date(), "eeee, dd 'de' MMMM 'de' yyyy, HH:mm:ss", {
      locale: es
    });
    actualTime = actualTime.charAt(0).toUpperCase() + actualTime.slice(1);
    return actualTime;
  }

  // FUNCION QUE OBTIENE CONVERSACIONES DE USUARIO Y LAS GUARDA EN VARIABLE CONVERSATIONS
  conversationsUser() {
    this.chatbotService.getUserConversation(this.authService.getUsername()).subscribe({
      next: (data: any) => {
        this.chatbotService.updateConversationNumber(data.length);
        this.conversationsNumber = data.length;

        this.conversations = data;

      },
      error: (error) => {
        //console.log(error);
      },
      complete: () => {
        // ORDENA CONVERSACIONES POR ID DESCENDENTE QUE A SU VEZ ES POR FECHA DE MAS NUEVA A MAS ANTIGUA
        this.conversations = this.conversations.sort((a: Conversation, b: Conversation) => {
          if (a.id && b.id) {
            return b.id.localeCompare(a.id);
          }
          return 0;
        });
      }
    });
  }
  // FUNCION QUE OBTIENE CONVERSACION POR ID
  getConversation(id: string) {
    this.chatbotService.getConversation(id).subscribe((data: any) => {
      this.chatbotService.fullConversation = data;
      this.fullConversation = data;
      this.messages = this.chatbotService.fullConversation.conversation;
      this.chatbotService.updateConversationNumber(this.conversations.length);
    })
  }
  // FUNCION QUE BORRA CONVERSACION POR ID
  deleteConversation(id: string) {
    this.chatbotService.deleteConversation(id).subscribe(() => {
      this.conversationsUser();
    });
  }

  //APERTURA DE DIALOGO DE CONFIRMACION DE BORRADO DE CONVERSACION
  openDialog(id: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
    });
    dialogRef.afterClosed().subscribe(result => {
      const resultString = result as string;
      if (resultString === 'confirmar') {
        this.deleteConversation(id);
      };
    });
  }

  //APERTURA DE DIALOGO DE CONFIRMACION DE EDITAR DE CONVERSACION
  editTitleDialog(conversation: Conversation): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { title: conversation.title, conversationNumber: 1 },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) { return }
      else {
        conversation.title = result;
        this.chatbotService.fullConversation = conversation;
        this.fullConversation = conversation;
        this.messages = this.fullConversation.conversation;
        this.chatbotService.sendConversation();

      }

    });
  }

  // FUNCION QUE GUARDA CONVERSACION
  saveConversation() {
    this.chatbotService.sendConversation();
  }

}
