// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {

      //Get the attribute manager and establish session attributes for this game.
      const attributesManager = handlerInput.attributesManager;
      
      const attributes = attributesManager.getPersistentAttributes() || {};
      if (Object.keys(attributes).length === 0) {
        attributes.counter = 0;
      }

      attributesManager.setSessionAttributes(attributes);
      //var speechoutput = '<audio src="https://s3.amazonaws.com/public-andrew-460481562341-us-east-1/Game_Intro.mp3" />';
//      const speechText = 'The game has invoked itself properly.'      ;
      const speechText =  'yay! <audio src="https://s3.amazonaws.com/public-andrew-460481562341-us-east-1/Game_Intro.mp3" />';
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};
const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
    },
    handle(handlerInput) {
      console.log(JSON.stringify(handlerInput,null,2));

      //let's just see if we can get to the attributes 
      const attributesManager = handlerInput.attributesManager;

      attributes = attributesManager.getSessionAttributes();
      const counterValue = attributes.counter;
      const speechText =  'yay! <audio src="https://s3.amazonaws.com/public-andrew-460481562341-us-east-1/Game_Intro.mp3" />';
      //const speechText = 'Yay! I got past getting attributes! '+counterValue;
      attributes.counter+=1;

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt('this is the reprompt Dan put in')
        .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
      const speechText = 'You can say hello to me! How can I help?';
     
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
   handle(handlerInput) {
      const speechText = 'Goodbye!';
      return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      // Any cleanup logic goes here.
      return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
      const intentName = handlerInput.requestEnvelope.request.intent.name;
      const speechText = `You just triggered ${intentName}`;
 
      return handlerInput.responseBuilder
        .speak(speechText)
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse();
   }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`~~~~ Error handled: ${error.message}`);
      const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
  .addErrorHandlers(
    ErrorHandler)
  .lambda();