public with sharing class SentimentController {
    @AuraEnabled
    public static String getSentiment(String message) {
        return JSON.serialize(SentimentService.analyzeSentiment(message));
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