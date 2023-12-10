import { Component, Input, OnInit } from '@angular/core';
import { ChatbotComponent } from '../../chatbot.component';
import { ChatbotServiceService } from '../../chatbot-services/chatbot-service.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DialogOverviewExample } from "../save-button/save-button.component";
import { MatButtonModule } from '@angular/material/button';
import { newDialogOverviewExample } from '../new-chat-button/new-chat-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Alignment } from 'pdfmake/interfaces';

// PARA PDFMAKE
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-chatbot-buttons',
  templateUrl: './chatbot-buttons.component.html',
  styleUrls: ['./chatbot-buttons.component.css'],
  standalone: true,
  providers: [],
  imports: [ChatbotComponent, DialogOverviewExample, MatButtonModule, newDialogOverviewExample,MatTooltipModule]
})

export class ChatbotButtonsComponent implements OnInit {
  @Input() title!: string;
  @Input() conversations: any;

  constructor(private chatbotService: ChatbotServiceService) { }

  ngOnInit() {

  }


  conversionAPdf() {
    this.conversationToPdf(this.chatbotService.fullConversation);
  }
  conversationToPdf(conversation: any) {
    const docDefinition = {
      content: [
        { text: 'Titulo: ' + conversation.title+'\n\n', style: 'header' },
        { text: 'Usuario: ' + conversation.user, bold: true },
        { text: 'Fecha conversacion: ' + conversation.date, bold: true },
        { text: '\n', style:'header' },
        { text: '\nConversacion:\n\n', bold: true },
        {
          ul: conversation.conversation.map((item: any) => `\t    Emisor:  ${item.type}\n\t    Mensaje:\n ${item.text}\n\t     Hora: ${item.time}\n\n`),
        },
      ],
      // Mueve la definición de estilos fuera del contenido
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center' as Alignment
        }
      }
    };
    pdfMake.createPdf(docDefinition).download('conversation.pdf');
  }
}


