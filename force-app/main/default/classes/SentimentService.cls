public with sharing class SentimentService {
    
    public class SentimentResponse {
        public String sentiment;
        public String explanation;
    }
    

    public static SentimentResponse analyzeSentiment(String messages) {
        Map<String,ConnectApi.WrappedValue> valueMap = new Map<String,ConnectApi.WrappedValue>();
        ConnectApi.EinsteinPromptTemplateGenerationsInput promptGenerationInput = new ConnectApi.EinsteinPromptTemplateGenerationsInput();
        promptGenerationInput.isPreview = false;

        Map<String, Object> inputValues = new Map<String, Object>();
        inputValues.put('Input:FreeText', messages);

        ConnectApi.EinsteinPromptTemplateGenerationsRepresentation generationOutput = generateOutput(inputValues, 'PromptTemplateGenerationsInvocable', 'SentimentAnalysis');
        
/*         if(generationOutput.generations == null || generationOutput.generations.isEmpty()) {
            System.debug('No generations found in the response.');
            throw new CustomException();
        } */
        
        System.debug('Full response: ' + JSON.serialize(generationOutput.generations));
        System.debug('Response: ' + JSON.serialize(generationOutput.generations[0].text));

        return (SentimentResponse)JSON.deserialize(generationOutput.generations[0].text, SentimentResponse.class);

    }

   

    //Isolar numa "PromptService"?
    private static ConnectApi.EinsteinPromptTemplateGenerationsRepresentation generateOutput(Map<String, Object> inputValues, String applicationName, String templateAPIName){
        Map<String,ConnectApi.WrappedValue> valueMap = new Map<String,ConnectApi.WrappedValue>();
        ConnectApi.EinsteinPromptTemplateGenerationsInput promptGenerationInput = new ConnectApi.EinsteinPromptTemplateGenerationsInput();
        promptGenerationInput.isPreview = false;

        for(String inputName : inputValues.keySet()){    
            ConnectApi.WrappedValue wrappedInput = new ConnectApi.WrappedValue();
            wrappedInput.value = inputValues.get(inputName);

            valueMap.put(inputName, wrappedInput);
        }
        promptGenerationInput.inputParams = valueMap;

        promptGenerationInput.additionalConfig = new ConnectApi.EinsteinLlmAdditionalConfigInput();
        promptGenerationInput.additionalConfig.applicationName = applicationName;

        ConnectApi.EinsteinPromptTemplateGenerationsRepresentation generationOutput = ConnectApi.EinsteinLLM.generateMessagesForPromptTemplate(templateAPIName, promptGenerationInput);

        return generationOutput;
    }

}
