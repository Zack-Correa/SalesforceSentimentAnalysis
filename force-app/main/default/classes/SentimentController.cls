public with sharing class SentimentController {
    @AuraEnabled(cacheable=true)
    public static String getSentiment(String message) {
        return SentimentService.analyzeSentiment(message);
    }
}