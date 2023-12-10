export interface Message {
  type: string;
  text: string;
  time: string;
  boolean?: boolean;
}
export interface Conversation {
  id?:string;
  user: string;
  date: string;
  title: string;
  conversation: Message[];
}
