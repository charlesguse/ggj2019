// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
//Template for Audio source tag: ' <audio src="PUTURLHERE" />';
const Alexa = require('ask-sdk-core');
const eventMap = require('event-map.json');
const GAMEINTROFILELOCATION =  ' <audio src="https://s3.amazonaws.com/public-andrew-460481562341-us-east-1/Game_Intro.mp3" />';
const S1FILELOCATION = ' <audio src="https://s3.amazonaws.com/public-andrew-460481562341-us-east-1/S1_Prompt.mp3" />';
const S1YESFILELOCATION = ' <audio src="https://s3.amazonaws.com/public-andrew-460481562341-us-east-1/S1_Out1_Yes.mp3" />';
const S1NOFILELOCATION = ' <audio src="https://s3.amazonaws.com/public-andrew-460481562341-us-east-1/S1_Out2_No.mp3" />';
const S1MAKEITWORKFILELOCATION = ' <audio src="https://s3.amazonaws.com/public-andrew-460481562341-us-east-1/S1_Out3_MakeItWork.mp3" />';
const S2FILELOCATION = ' <audio src="https://s3.amazonaws.com/public-andrew-460481562341-us-east-1/S2_Prompt_Genet.mp3" /> ';

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
        attributes.charlieCurrentQuestion = -1;
        attributes.awaitingResponse = false;
      }

      cats = attributes.cats;
      cash = attributes.cash;
      crazy = attributes.crazy;

      attributesManager.setSessionAttributes(attributes);

      //const speechText =  ' <audio src="https://s3.amazonaws.com/public-andrew-460481562341-us-east-1/Game_Intro.mp3" />  You have ' + attributes.cats + ' cats, ' + cash + ' dollars cash, and your crazy factor is ' + crazy + ' percent. Good luck! Your friend Catherine has to leave for a business conference out of town. She has not been able to find anyone to watch her Jack Russell Terrier puppy while she is gone. She is asking if Pepper can stay with you for just a few days. How do you respond? YES, let us make it a party? NO, I would love to but it is too crazy right now? Or, I will make it work?';
      const speechText =  GAMEINTROFILELOCATION +  ' You have ' + attributes.cats + ' cats, ' + cash + ' dollars cash, and your crazy factor is ' + crazy + ' percent. Good luck! '+ S1FILELOCATION;
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
      attributes = attributesManager.getSessionAttributes();
      const theCurrentQuestion = attributes.currentQuestion;
      

      const intentName = handlerInput.requestEnvelope.request.intent.name;
      const speechText = `You just triggered ${intentName} with current question ` + theCurrentQuestion;
 
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

//HANDLER FOR QUESTION 1
const LetsMakeAPartyIntentHandler = {
  canHandle(handlerInput) {
    // const attributesManager = handlerInput.attributesManager;
    // attributes = attributesManager.getSessionAttributes();
    // const theCurrentQuestion = attributes.currentQuestion;
    const theCurrentQuestion = GetQuestionNumber(handlerInput);

    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'LetsMakeAPartyIntent'
      && theCurrentQuestion == 1;
  },
  handle(handlerInput) {
    
    //Get the attributes to manipulate values
    const attributesManager = handlerInput.attributesManager;

    attributes = attributesManager.getSessionAttributes();
    const cash =  attributes.cash + 300;

    attributes.cash += 300;
    

    const speechText = S1YESFILELOCATION +  'You now have ' +cash +' dollars! Pepper seems to get along with your feline friends as well!' + S2FILELOCATION;
    //const speechText = S1YESFILELOCATION + 
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('WILL THIS ASK QUESTION TWO?!')
      .getResponse();
  }
};

const TooCrazyIntentHandler = {
  canHandle(handlerInput) {
    const theCurrentQuestion = GetQuestionNumber(handlerInput);
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TooCrazyIntent'
      && theCurrentQuestion == 1;
    },
  handle(handlerInput) {
    const speechText = S1NOFILELOCATION + S2FILELOCATION;
  //  this.emit(':ask','this is the second question text. DRN what do we do?');
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('WILL THIS ASK QUESTION TWO?!')
      .getResponse();
  }
};

const IWillMakeItWorkIntentHandler = {
  canHandle(handlerInput) {
    const theCurrentQuestion = GetQuestionNumber(handlerInput);
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'IWillMakeItWorkIntent'
      && theCurrentQuestion == 1;
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
    const speechText = S1MAKEITWORKFILELOCATION + ' You now have '+cats+' cats, ' + cash + ' dollars, and your crazy factor is up to ' + crazy + 'percent!' + S2FILELOCATION;
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('WILL THIS ASK QUESTION TWO?!')
      .getResponse();
  }
};





const LifeEventIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'LifeEventIntent'
      && !AwaitingResponse(handlerInput);
  },
  handle(handlerInput) {
    // const attributesManager = handlerInput.attributesManager;
    // attributes = attributesManager.getSessionAttributes();
    // attributes.awaitingResponse = true;

    // const length = length(eventMap.events);
    // do {
    //   newQuestion = Math.floor(Math.random() * length);
    // } while (attributes.charlieCurrentQuestion !== newQuestion)
    // attributes.charlieCurrentQuestion = newQuestion;
    // let event = eventMap.events[newQuestion]
    // // Any cleanup logic goes here.
    // const speechText = event.prompt;
    const speechText = "Dan be helpin";
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  }
};

const YesResponseLifeEventIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'YesResponseLifeEventIntent'
      && AwaitingResponse(handlerInput);
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    attributes = attributesManager.getSessionAttributes();
    attributes.awaitingResponse = false;
    const  currentQuestion = attributesManager.charlieCurrentQuestion;
    let event = eventMap.events[currentQuestion];
    const speechText = event.yes;
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  }
};

const NoResponseLifeEventIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'NoResponseLifeEventIntent'
      && AwaitingResponse(handlerInput);
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    attributes = attributesManager.getSessionAttributes();
    attributes.awaitingResponse = false;
    const  currentQuestion = attributesManager.charlieCurrentQuestion;
    let event = eventMap.events[currentQuestion];
    const speechText = event.no;
    return handlerInput.responseBuilder
      .speak(speechText)
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
    LifeEventIntentHandler,
    YesResponseLifeEventIntentHandler,
    NoResponseLifeEventIntentHandler,
    
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
  .addErrorHandlers(
    ErrorHandler)
  .lambda();

//DRN - Centralizing the logic to get Session value for current question number. 
function GetQuestionNumber(handlerInput) {
  const attributesManager = handlerInput.attributesManager;
  attributes = attributesManager.getSessionAttributes();
  return attributes.currentQuestion;
}

function AwaitingResponse(handlerInput) {
  const attributesManager = handlerInput.attributesManager;
  attributes = attributesManager.getSessionAttributes();
  return attributes.awaitingResponse;
}