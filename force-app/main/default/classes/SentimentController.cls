public with sharing class SentimentController {
    @AuraEnabled
    public static String getSentiment(String message) {
        Map<String, Object> responseMap = new Map<String, Object>();
        try {
            SentimentService.SentimentResponse promptResponse = SentimentService.analyzeSentiment(message);
            responseMap.put('success', true);
            responseMap.put('value', JSON.serialize(promptResponse));
        }
        catch (Exception e) {
            responseMap.put('success', false);
            responseMap.put('error', e.getMessage());
        }

        return JSON.serialize(responseMap);
    }

    @AuraEnabled
    public static String getComponentDefinitions(){
        Map<String, Object> responseMap = new Map<String, Object>();
        SentimentAnalysisDefinitions__c definitions = SentimentAnalysisDefinitions__c.getInstance();
        try {   
            if(definitions != null) {
                responseMap.put('success', true);
                responseMap.put('value', JSON.serialize(definitions));
            }
            else {
                responseMap.put('success', false);
                responseMap.put('error', 'Definitions not found');
            }
        } catch (Exception e) {
            responseMap.put('success', false);
            responseMap.put('error', e.getMessage());
        }

        return JSON.serialize(responseMap);
    }
}