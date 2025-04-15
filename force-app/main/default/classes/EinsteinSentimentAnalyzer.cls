public class EinsteinSentimentAnalyzer implements ISentimentAnalyzer{
    private EinsteinPromptService promptService;

    EinsteinSentimentAnalyzer(EinsteinPromptService promptService) {
        promptService = promptService;
    }
    public ConnectApi.EinsteinPromptTemplateGenerationsRepresentation analyzeSentiment(String messages) {
        return promptService.prompt('SentimentAnalysis', messages);
    }
}