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
        attributes.cats = 2; //Start with two cats? STORYQUESTION
        attributes.cash = 1000; //What is the starting cash? STORYQUESTION
        attributes.crazy = 50; //I was thinking of this as a percentage from zero to 100 STORYQUESTION
        attributes.currentQuestion = 1; //Need to track this to keep track of which Intent should be used.
      }

      cats = attributes.cats;
      cash = attributes.cash;
      crazy = attributes.crazy;

      attributesManager.setSessionAttributes(attributes);

      const speechText =  ' <audio src="https://s3.amazonaws.com/public-andrew-460481562341-us-east-1/Game_Intro.mp3" />  You have ' + attributes.cats + ' cats, ' + cash + ' dollars cash, and your crazy factor is ' + crazy + ' percent. Good luck! Your friend Catherine has to leave for a business conference out of town. She has not been able to find anyone to watch her Jack Russell Terrier puppy while she is gone. She is asking if Pepper can stay with you for just a few days. How do you respond? YES, let us make it a party? NO, I would love to but it is too crazy right now? Or, I will make it work?';
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};
//The goal is to deprecate this with additional handlers.
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
      //const speechText =  'yay! <audio src="https://s3.amazonaws.com/public-andrew-460481562341-us-east-1/Game_Intro.mp3" />';
      //const speechText = 'Yay! I got past getting attributes! '+counterValue;
      speechText = 'Yay!'
      
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

      const attributesManager = handlerInput.attributesManager;
      const theCurrentQuestion = attributesManager.currentQuestion;

      const intentName = handlerInput.requestEnvelope.request.intent.name;
      const speechText = `You just triggered ${intentName} with current question` + theCurrentQuestion;
 
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

const LetsMakeAPartyIntentHandler = {
  canHandle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const theCurrentQuestion = attributesManager.currentQuestion;

    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'LetsMakeAPartyIntent'
      && theCurrentQuestion === 1;
  },
  handle(handlerInput) {
    
    //Get the attributes to manipulate values
    const attributesManager = handlerInput.attributesManager;

    attributes = attributesManager.getSessionAttributes();
    const cash =  attributes.cash - 300;

    attributes.cash -= 300;
    

    const speechText = 'You welcome Pepper with open arms and hold a party in her honor! One gift you bring are lotto tickets to celebrate her good luck. She is lucky because you just won $300! You now have ' +cash +' dollars! Pepper seems to get along with your feline friends as well!';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('this is the reprompt Dan put in')
      .getResponse();
  }
};

const TooCrazyIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TooCrazyIntent';
  },
  handle(handlerInput) {
    const speechText = 'You apologize for any inconvenience, but life is just too crazy. Gain 0 stress relief and 0 Dollars';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('this is the reprompt Dan put in')
      .getResponse();
  }
};

const IWillMakeItWorkIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'IWillMakeItWorkIntent';
  },
  handle(handlerInput) {
    
    // Lose 2 cats, gain 20 stress and lose $100.';
    //let's just see if we can get to the attributes 
    const attributesManager = handlerInput.attributesManager;

    attributes = attributesManager.getSessionAttributes();
    const cash =  attributes.cash - 100;
    const crazy = attributes.crazy + 20;
    const cats = attributes.cats - 2;

    attributes.cash -= 100;
    attributes.crazy += 20
    attributes.cats -= 2;

    // Any cleanup logic goes here.
    const speechText = 'You take in the cute Pepper, but realize that cats and dogs do not mix and two of your kitties run away into the walls. Catherine also forgot to mention that sweet innocent Pepper is not house broken and she makes you lose your pet deposit. Lose 2 cats, gain 20 stress and lose $100. You now have '+cats+' cats, ' + cash + ' dollars, and your crazy factor is up to ' + crazy + '!';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('this is the reprompt Dan put in')
      .getResponse();
  }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    LetsMakeAPartyIntentHandler,
    TooCrazyIntentHandler,
    IWillMakeItWorkIntentHandler,
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
  .addErrorHandlers(
    ErrorHandler)
  .lambda();