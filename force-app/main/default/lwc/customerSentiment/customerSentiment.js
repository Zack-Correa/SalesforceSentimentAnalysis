import { LightningElement, api, track } from 'lwc';
import getSentiment from '@salesforce/apex/SentimentController.getSentiment';
import getSentimentExplanation from '@salesforce/apex/SentimentController.getSentimentExplanation';

export default class CustomerSentiment extends LightningElement {
    @api recordId; // ID da Messaging Session
    @track sentiment = 'Neutro';
    @track sentimentExplanation = '';
    
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

    // Método acionado ao clicar no botão
    handleAnalyze() {
        // Pode-se obter o conteúdo da mensagem a partir do registro ou de um serviço integrado à sessão de chat.
        // Aqui, usamos uma mensagem de exemplo para demonstração.
        const conversationMessage = 'O atendimento foi excelente, fiquei muito satisfeito!';
        
        getSentiment({ message: conversationMessage })
            .then(result => {
                this.sentiment = result;
                return getSentimentExplanation({ sentiment: result });
            })
            .then(explanation => {
                this.sentimentExplanation = explanation;
            })
            .catch(error => {
                console.error('Erro na análise de sentimento: ', error);
            });
    }
}
