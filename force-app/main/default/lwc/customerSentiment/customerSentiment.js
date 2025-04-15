import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { subscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import ConversationEndUserChannel from '@salesforce/messageChannel/lightning__conversationEndUserMessage';
import ConversationEndedChannel from '@salesforce/messageChannel/lightning__conversationEnded';

import getSentiment from '@salesforce/apex/SentimentController.getSentiment';
import getComponentDefinitions from '@salesforce/apex/SentimentController.getComponentDefinitions';

export default class CustomerSentiment extends LightningElement {
    @api recordId; // ID da Messaging Session
    @track sentiment;
    @track sentimentExplanation = '';
    @track calculatingSentiment = false;
    @track sentimentAnalysisButtonEnabled = false;
    receiveingSubscription = null;
    conversationEndedSubscription = null;

    isSentimentEnabled;
    calculationMode;


    @wire(MessageContext)
    messageContext;

    async getComponentDefinitions(){
        return new Promise(async (resolve, reject) => {
            let data = await getComponentDefinitions();
            let parsedData;

            if(data){
                parsedData = JSON.parse(data);
                if (parsedData.success) {
                    let values = JSON.parse(parsedData.value);
                    this.handleSentimentDefinitions(values);
                    resolve();
                } else {
                    reject('Error fetching component definitions: ' + parsedData.error);
                }
            }
            else{
                reject('Error fetching component definitions: Couldn\'t parse data');
            }
        });
    
    }

    handleSentimentDefinitions(values) {
        if (!values.ComponentEnabled__c) {
            console.log('Sentiment Analysis is disabled');
            this.disableSentimentAnalysis();
            resolve();
        }
        
        this.processActions(values);
    }

    disableSentimentAnalysis() {
        this.isSentimentEnabled = false;
    }

    processActions(values) {
        const actions = [
            { flag: 'CalculateSentimentButtonClick__c', action: this.enableAnalysisButton },
            { flag: 'CalculateSentimentConversationEnd__c', action: this.subscribeToConversationEnded },
            { flag: 'CalculateSentimentEveryMessage__c', action: this.subscribeToReceivedMessage }
        ];
    
        actions.forEach(({ flag, action }) => {
            if (values[flag]) {
                action.call(this);
            }
        });
    }
    
    async connectedCallback() {
        this.getComponentDefinitions()
        .then(() => {
            console.log('Component definitions fetched successfully');
            //this.setAnalysisMode();
        })
        .catch(error => {
            console.error('Error fetching component definitions: ' + error);
        });

    }

    enableAnalysisButton(){
        this.sentimentAnalysisButtonEnabled = true;
    }

    async calculateConversationSentiment() {
        this.calculatingSentiment = true;
        const toolKit = this.refs.lwcToolKitApi;

        try{
            let result = await toolKit.getConversationLog(this.recordId);
            console.log(result);
            let messageLog = [];
            for(let message of result.messages) {
              var msg = {
                  content:message.content,
                  author:message.name,
              }
              messageLog.push(msg);
            }
            this.analyzeMessages(JSON.stringify(messageLog));
        }
        catch(error) {
            console.error('Error fetching conversation log: ' + error);
            this.calculatingSentiment = false;
        }
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

    async analyzeMessages(messages) {  
        let response = await getSentiment({ message: messages });

        response = JSON.parse(response);
        if(!response.error) {
            this.sentiment = response.sentiment;
            this.sentimentExplanation = response.explanation;
        }

        this.calculatingSentiment = false;
    }

    subscribeToReceivedMessage() {
        if (!this.receiveingSubscription) {
            this.receiveingSubscription = subscribe(
                this.messageContext,
                ConversationEndUserChannel,
                (message) => this.handleMessageReceived(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    subscribeToConversationEnded() {
        if (!this.conversationEndedSubscription) {
            this.conversationEndedSubscription = subscribe(
                this.messageContext,
                ConversationEndedChannel,
                (message) => this.handleConversationEnded(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    handleMessageReceived(message) {
        this.calculatingSentiment = true;
        let parsedMessage = JSON.stringify({
            content: message.content,
            author: message.name
        });
        this.analyzeMessages(parsedMessage);
    }

    handleConversationEnded(){
        this.calculateConversationSentiment();
    }

    
}
