public interface ISentimentAnalyzer {
    ConnectApi.EinsteinPromptTemplateGenerationsRepresentation analyzeSentiment(String messages);
}