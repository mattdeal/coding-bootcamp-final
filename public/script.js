var QUESTION_NUM = 0; //counter used to ensure each question get's the correct sort order
const QUESTION_SHORT = 'short';
const QUESTION_MULTI = 'multi';
const QUESTION_SINGLE = 'single';
const QUESTION_TOGGLE = 'toggle';
const PANEL_HEAD = '<li><div class="panel panel-default"><div class="panel-body">';
const PANEL_FOOT = '</div></div></li>';

// log user out of the application (not google), and hide all items that require a session
function onGoogleSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');

        //hide ui items that require login
        $(".sign-in-required").hide();

        //todo: show login button
        //todo: hide logout button
    });
}

// log user into the application (not google), and show all items that require a session
function onGoogleSignIn(googleUser) {
    console.log('valid user');

    //show ui to logged in user
    $(".sign-in-required").show();

    //todo: hide login button
    //todo: show logout button
}

// google's version of document.ready
google.setOnLoadCallback(googleReady);

// create html for an input that allows a user to specify question text
function createQuestionText(questionType) {
    var inputId = 'question_' + QUESTION_NUM;

    return '<div class="form-group">' + 
        '<label for="' + inputId + '" class="col-lg-2 control-label">Question Text</label>' + 
        '<div class="col-lg-10">' + 
        '<input type="text" class="form-control question-text" id="' + inputId + 
        '" data-question-id="' + QUESTION_NUM + 
        '" data-question-type="' + questionType + 
        '" placeholder="Question Text">' + 
        '</div></div>';
}

// todo: determine if this is necessary
function createShortAnswer() {
    return '';
}

// todo: determine if this is necessary
function createToggle() {
    return '';
}

// create html that will allow a user to add multiple options to a select question
function createOptions() {
    // question id
    // answer div for this question
    // button to add new options
    var optionInput = 'option_' + QUESTION_NUM;
    var answerContainer = 'answers_' + QUESTION_NUM;
    
    return '<div class="form-group">' +
    '<label class=" col-lg-2 control-label">Add Options</label>' +
    '<div class="col-lg-10">' + 
    '<div class="input-group">' +
    '<input type="text" class="form-control" id="' + optionInput + '">' +
    '<span class="input-group-btn">' +
    '<button class="btn btn-default btn-add-option" data-question-id="' + 
    QUESTION_NUM + '" data-answer-container="' + answerContainer + 
    '" data-answer-input="' + optionInput +
    '" type="button">Add</button>' +
    '</span>' +
    '</div>' +
    '</div>' + 
    '<div class="col-lg-10 col-lg-offset-2">' + 
    '<ol id="' + answerContainer + '"></ol>' +
    '</div>' + 
    '</div>';
}

// call any google specific functions here
function googleReady() {
    console.log('google ready');    
}

// create html to display a short question
function createQuestionShortAnswer() {
    var newQuestion = PANEL_HEAD;
    newQuestion += createQuestionText(QUESTION_SHORT);
    newQuestion += createShortAnswer();
    newQuestion += PANEL_FOOT;
    
    QUESTION_NUM++;
    
    var result = $.parseHTML(newQuestion);
    console.log(result);

    $('#question-container').append(result);
}

// create html to display a multi question
function createQuestionSelectSingle() {
    var newQuestion = PANEL_HEAD;
    newQuestion += createQuestionText(QUESTION_SINGLE);
    newQuestion += createOptions();
    newQuestion += PANEL_FOOT;
    
    QUESTION_NUM++;
    
    var result = $.parseHTML(newQuestion);
    console.log(result);

    $('#question-container').append(result);
}

// create html to display a multi option question
function createQuestionSelectMultiple() {
    var newQuestion = PANEL_HEAD;
    newQuestion += createQuestionText(QUESTION_MULTI);
    newQuestion += createOptions();
    newQuestion += PANEL_FOOT;
    
    QUESTION_NUM++;
    
    var result = $.parseHTML(newQuestion);
    console.log(result);

    $('#question-container').append(result);
}

// create html to display a toggle question
function createQuestionToggle() {
    var newQuestion = PANEL_HEAD;
    newQuestion += createQuestionText(QUESTION_TOGGLE);
    newQuestion += createToggle();
    newQuestion += PANEL_FOOT;
    
    QUESTION_NUM++;
    
    var result = $.parseHTML(newQuestion);
    console.log(result);

    $('#question-container').append(result);
}

// create the html to display survey details in a single line
function createSurveyView(survey) {
    console.log('createSurveyView');
    console.log(survey);

    return '<li>' + 
    '<div class="row">' +
    '<div class="col-xs-2">' + (survey.active ? 'OPEN' : 'CLOSED') + '</div>' +
    '<div class="col-xs-9">' + survey.name + '</div>' +
    '<div class="col-xs-1"><div class="btn btn-primary btn-block btn-view-survey" data-survey-id="' + survey._id + '">View</div></div>' +
    '</div>' + 
    '</li>';
}

// create a new survey
function saveSurvey() {
    var surveyObj = {
        name: 'Placeholder',
        questions: []
    };

    var questions = $('.question-text');
    console.log(questions);
    for (var i = 0; i < questions.length; i++) {
        var question = $(questions[i]);
        var questionId = question.data('question-id');
        var questionText = question.val().trim();
        var questionType = question.data('question-type');

        var questionObj = {
            order: questionId,
            text: questionText,
            questionType: questionType,
            answers: []
        };

        switch(questionType) {
            case QUESTION_TOGGLE:
            case QUESTION_SHORT:
                console.log('short answer or toggle, no action necessary');

                console.log(questionObj);

                surveyObj.questions.push(questionObj);
            break;
            case QUESTION_SINGLE:
            case QUESTION_MULTI:
                console.log('multi option question, getting potential answers');
                var answers = $('.answer_' + questionId);
                for (var j = 0; j < answers.length; j++) {
                    console.log(answers[j]);
                    var answerText = $(answers[j]).data('option-text');
                    questionObj.answers.push(answerText);
                }

                console.log(questionObj);

                surveyObj.questions.push(questionObj);
            break;
            default:
                console.log('error, unknown questionType');
            break;
        }
    }

    // POST survey object with user token to validate
    if (gapi.auth2) {
        var profile = gapi.auth2.getAuthInstance().currentUser.get();
        var token = profile.getAuthResponse().id_token;
        var args = {
            survey: surveyObj,
            token: token
        };
        
        $.post('/survey', args).then(function(result) {
            console.log('saveSurvey received');
            console.log(result);

            //todo: take user to results page?
        });
    } else {
        console.log('gapi.auth2 not found');
    }
}

// get a list of surveys the current user owns
function getSurveys() {
    if (gapi.auth2) {
        var profile = gapi.auth2.getAuthInstance().currentUser.get();
        var token = profile.getAuthResponse().id_token;
        var args = {
            token: token
        };
        
        $.get('/surveys', args).then(function(result) {
            console.log('getSurveys received');
            console.log(result);

            // display a list of all surveys owned by this user
            displaySurveys(result);
        });
    } else {
        console.log('gapi.auth2 not found');
    }
}

// add surveys to a list
function displaySurveys(surveys) {
    console.log('displaySurveys');

    var surveyList = $('#survey-list');
    surveyList.html('');

    var surveyView = $('#survey-view'); 
    surveyView.html('');

    for (var i = 0; i < surveys.length; i++) {
        surveyList.append(createSurveyView(surveys[i]));
    }
}

//note: this is how you get the user's token for validation
$(document).on("click", "g-signin2", function(e){
    e.preventDefault();
    if (gapi.auth2) {
        var profile = gapi.auth2.getAuthInstance().currentUser.get();
        $.post('/validate', { token: profile.getAuthResponse().id_token }).then(function(result) {
            console.log('/validate result=', result);
        });
    } 
});

$(document).on("click", "#btn-question-short", function(e) {
    e.preventDefault();
    console.log('short answer');
    createQuestionShortAnswer();
});

$(document).on("click", "#btn-question-multi", function(e) {
    e.preventDefault();
    console.log('multi choice');
    createQuestionSelectMultiple();
});

$(document).on("click", "#btn-question-single", function(e) {
    e.preventDefault();
    console.log('checkbox');
    createQuestionSelectSingle();
});

$(document).on("click", "#btn-question-toggle", function(e) {
    e.preventDefault();
    console.log('toggle');
    createQuestionToggle();
});

$(document).on("click", "#btn-save-survey", function(e) {
    e.preventDefault();
    console.log('save survey');
    saveSurvey();
});

$(document).on("click", ".btn-add-option", function(e) {
    e.preventDefault();
    
    console.log('add option');

    console.log($(this));

    var optionInputId = $(this).data('answer-input');
    console.log(optionInputId);
    var optionInput = $('#' + optionInputId);
    var optionText = optionInput.val().trim();

    var answerContainerId = $(this).data('answer-container');
    console.log(answerContainerId);
    var answerContainer = $('#' + answerContainerId);

    var questionId = $(this).data('question-id');

    answerContainer.append('<li class="answer_' + questionId + 
    '" data-question-id="' + questionId + 
    '" data-option-text="'+ optionText + 
    '">' + optionText + '</li>');

    optionInput.val('');
});

$(document).on("click", "#btn-nav-create", function(e) {
    e.preventDefault();
    console.log('create survey');
    $("#row-create-survey").show();
    $("#row-view-survey").hide();
});

$(document).on("click", "#btn-nav-view", function(e) {
    e.preventDefault();
    console.log('view survey');
    $("#row-create-survey").hide();
    $("#row-view-survey").show();
    getSurveys();
});

$(document).on("click", ".btn-view-survey", function(e) {
    e.preventDefault();
    console.log('btn-view-survey');
    console.log($(this).data('survey-id'));
    //todo: get the results for this survey
});