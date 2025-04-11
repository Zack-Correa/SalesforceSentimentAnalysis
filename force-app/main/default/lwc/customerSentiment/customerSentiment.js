import { LightningElement, api, track, wire } from 'lwc';
import {
    subscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import getSentiment from '@salesforce/apex/SentimentController.getSentiment';
import ConversationAgentSendChannel from '@salesforce/messageChannel/lightning__conversationAgentSend';
import ConversationEndUserChannel from '@salesforce/messageChannel/lightning__conversationEndUserMessage';

export default class CustomerSentiment extends LightningElement {
    @api recordId; // ID da Messaging Session
    @track sentiment = 'Neutral';
    @track sentimentExplanation = '';

    sentMessageSubscription = null;
    receiveingSubscription = null;

    lastMessage;

    @wire(MessageContext)
    messageContext;
    
    connectedCallback() {
        this.subscribeToSentMessage();
        this.subscribeToReceivedMessage();
    }
    
    get badgeStyle() {
        switch(this.sentiment) {
            case 'Positive':
                return 'background-color: #d8f3dc; color: #2d6a4f; padding: 0.25rem 0.5rem; border-radius: 0.25rem;';
            case 'Negative':
                return 'background-color: #ffccd5; color: #d00000; padding: 0.25rem 0.5rem; border-radius: 0.25rem;';
            default:
                return 'background-color: #f0f0f0; color: #666666; padding: 0.25rem 0.5rem; border-radius: 0.25rem;';
        }
    }

    async handleAnalyze() {  
        let response = await getSentiment({ message: this.lastMessage });

        response = JSON.parse(response);
        if(!response.error) {
            this.sentiment = response.sentiment;
            this.sentimentExplanation = response.explanation;
        }



    }

    subscribeToSentMessage() {
        if (!this.sentMessageSubscription) {
            this.sentMessageSubscription = subscribe(
                this.messageContext,
                ConversationAgentSendChannel,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    subscribeToReceivedMessage() {
        if (!this.receiveingSubscription) {
            this.receiveingSubscription = subscribe(
                this.messageContext,
                ConversationEndUserChannel,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    handleMessage(message) {
        this.lastMessage = JSON.stringify({
            content: message.content,
            author: message.name
        });
        this.handleAnalyze();
        console.log(message);
    }
}
