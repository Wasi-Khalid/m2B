import { Injectable } from '@angular/core';
import { ChatMessageModel } from '../models/chat-message.model';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AuthService } from '../authentication/core/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class ChatMessageService {

  public dbPath = '/chats';
  chatMessagesRef: AngularFireList<ChatMessageModel> = null;
  chatMessageRef: AngularFireObject<ChatMessageModel> = null;
  chatMessagesByoption: AngularFireList<ChatMessageModel>;


  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    public authService: AuthService
  ) {

    this.chatMessagesRef = db.list(this.dbPath);
  }

  createchatMessage(chatMessage: ChatMessageModel): void {
    this.chatMessagesRef.push(chatMessage);
  }
  setchatMessage(id: string, chatMessage: ChatMessageModel) {
    const itemPath = `${this.dbPath}/${id}`;
    this.chatMessageRef = this.db.object(itemPath);
    return this.chatMessageRef.set(chatMessage);
  }
  getchatMessages(): AngularFireList<ChatMessageModel> {
    return this.chatMessagesRef;
  }

  getchatMessagesByOption(option: string, value: string): AngularFireList<ChatMessageModel> {
    this.chatMessagesByoption = this.db.list(this.dbPath, ref => ref.orderByChild(option).equalTo(value));
    return this.chatMessagesByoption;
  }
  updatechatMessage(key: string, value: any): void {
    this.chatMessagesRef.update(key, value).catch(error => this.handleError(error));
  }
  private handleError(error) {
    console.log(error);
  }
}


