import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Conversation } from 'src/app/shared/models/interfaces/Chatbot.interface';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ChatbotServiceService {

  apiUrl =environment.apiUrl;

  private conversationNumber = new BehaviorSubject<number>(0);
  conversationNumber$ = this.conversationNumber.asObservable();

  fullConversation: Conversation = {
     user: '', date: '', title: '', conversation: []
  };
  private dataSubject = new BehaviorSubject<boolean>(false);
  data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) { }

  updateData(newValue: boolean) {
    newValue = !newValue;
    this.dataSubject.next(newValue);
  }

  cleanChat() {
    this.fullConversation = { user: '', date: '', title: '', conversation: [] };
  }

  sendConversation() {
    this.http.post(`${this.apiUrl}/conversation`,
    this.fullConversation).subscribe((data:any)=>this.fullConversation=data);
  }

  getUserConversation(user:string) {
    return this.http.get(`${this.apiUrl}/conversations/${user}`);
  }

  getConversation(id:string) {
    return this.http.get(`${this.apiUrl}/conversation/${id}`);
  }

  deleteConversation(id:string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateConversationNumber(number:number){
    this.conversationNumber.next(number);
  }

}
