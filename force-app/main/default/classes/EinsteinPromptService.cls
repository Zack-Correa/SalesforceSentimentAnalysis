public class EinsteinPromptService {
    public ConnectApi.EinsteinPromptTemplateGenerationsRepresentation prompt(String template, String prompt){
        return null;
    }


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