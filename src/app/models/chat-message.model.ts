export class MessageModel {
   
        message: string;
        timeSent: string ;
        senderId:string;
        senderEmail:string;
        constructor() {
            this.message = "";
            this.timeSent = "";
            this.senderId = "";
            this.senderEmail="";
            
        }
    
}

export class ChatMessageModel {
    $key: string;
    messages: MessageModel[];
    userName: string;
    userId:string;
    chatID:string;
    userEmail:string;
    supplierUnread:number;
    userUnread:number;
    lastAddedMsgDate: string;
    addOn:number;
    constructor() {
        this.messages = new Array();
        this.userName = "";
        this.chatID = "";
        this.userId = "";
        this.lastAddedMsgDate = "";
        this.supplierUnread= 0;
        this.userUnread= 0;
        this.addOn= 0;
    }

}

