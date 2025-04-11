public with sharing class SentimentController {
    @AuraEnabled
    public static String getSentiment(String message) {
        return JSON.serialize(SentimentService.analyzeSentiment(message));
    }
}