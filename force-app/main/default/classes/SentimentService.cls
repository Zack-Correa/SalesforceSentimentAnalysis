
//EinsteinSentimentService : EinsteinPromptService
//iSentimentService - analyzeSentiment

public with sharing class SentimentService {
    
    public class SentimentResponse {
        public String sentiment;
        public String explanation;
    }
    

    public static SentimentResponse analyzeSentiment(String messages) {
        Map<String, Object> inputValues = new Map<String, Object>();
        inputValues.put('Input:FreeText', messages);

        ConnectApi.EinsteinPromptTemplateGenerationsRepresentation generationOutput = generateOutput(inputValues, 'PromptTemplateGenerationsInvocable', 'SentimentAnalysis');
        
        if(generationOutput.generations == null || generationOutput.generations.isEmpty()) {
            System.debug('No generations found in the response.');
            throw new CustomException();
        }
        
        System.debug('Full response: ' + JSON.serialize(generationOutput.generations));
        System.debug('Response: ' + JSON.serialize(generationOutput.generations[0].text));

        return (SentimentResponse)JSON.deserialize(generationOutput.generations[0].text, SentimentResponse.class);

    }

   

    //Isolar numa "EinsteinPromptService"?
    //Implementar na base com construtor
    

}
