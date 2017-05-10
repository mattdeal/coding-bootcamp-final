var QUESTION_NUM = 0; //counter used to ensure each question get's the correct sort order
const QUESTION_SHORT = 'short';
const QUESTION_MULTI = 'multi';
const QUESTION_SINGLE = 'single';
const QUESTION_TOGGLE = 'toggle';
const PANEL_HEAD = '<li><div class="panel panel-default"><div class="panel-body">';
const PANEL_FOOT = '</div></div></li>';

// google's version of document.ready
google.setOnLoadCallback(googleReady);

// call any google specific functions here
function googleReady() {
    console.log('google ready');    
}

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
        name: $('#input-survey-name').val().trim(),
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

            if (result.error) {
                //todo: show that there's a problem
            } else {
                // hide this row
                hideRows();

                // clear question container
                $('#question-container').html('');

                // clear name
                $('#input-survey-name').val('');

                // show surveys
                getSurveys();

                // show survey row
                $('#row-view-survey').show();
            }
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

// display a survey for the user to fill in
function presentSurvey(survey) {
    var questionList = $('#response-question-list');
    questionList.html('');

    //todo: display survey name somewhere
    $('#display-survey-name').html(survey.name);

    for (var i = 0; i < survey.questions.length; i++) {
        questionList.append('<li>' + presentQuestion(survey.questions[i]) + '</li>');
    }
}

// display a single question for the user to fill in
function presentQuestion(question) {
    console.log(question.questionType);
    switch(question.questionType) {
        case QUESTION_SHORT:
            return prepareShortAnswerQuestion(question);
        case QUESTION_SINGLE:
            return prepareRadioButtonQuestion(question);
        case QUESTION_MULTI:
            return prepareCheckboxQuestion(question);
        case QUESTION_TOGGLE:
            return prepareToggleQuestion(question);
        default:
            console.log('error, weird questionType');
        break;
    }
}

function prepareShortAnswerQuestion(question) {
    var id = question._id;
    console.log('id=', id);
    console.log(question);

    var result = '<div class="panel panel-default">' + 
        '<div class="panel-heading">' + question.text + '</div>' +
        '<div class="panel-body">' +
        '<div class="form-group">' +
        '<div class="col-xs-12">' +
        '<input type="text" class="form-control answer-text"' + 
        ' data-question-id="' + question._id + '">' +
        '</div>' +
        '</div>' +
        '</div>' + 
        '</div>';

    return result;
}

function prepareRadioButtonQuestion(question) {
    var optionsString = '';
    for (var i = 0; i < question.answers.length; i++) {
        optionsString += '<div class="radio"><label>' +
            '<input type="radio" class="answer-radio"' + 
            ' data-question-id="' + question._id + 
            '" value="' + question.answers[i] +
            '">' + 
            question.answers[i] +
            '</label></div>';
    }
    var result = '<div class="panel panel-default">' + 
        '<div class="panel-heading">' + question.text + '</div>' +
        '<div class="panel-body">' +
        '<form class="form-horizontal"><fieldset>' +
        '<div class="form-group">' +
        '<div class="col-xs-12">' +
        optionsString +
        '</div>' +
        '</div>' +
        '</fieldset></form>' +
        '</div>' + 
        '</div>';

    return result;
}

function prepareCheckboxQuestion(question) {
        var optionsString = '';
    for (var i = 0; i < question.answers.length; i++) {
        optionsString += '<div class="checkbox"><label>' +
            '<input type="checkbox" class="answer-checkbox"' + 
            ' data-question-id="' + question._id + 
            '" value="' + question.answers[i] +
            '">' + 
            question.answers[i] +
            '</label></div>';
    }
    var result = '<div class="panel panel-default">' + 
        '<div class="panel-heading">' + question.text + '</div>' +
        '<div class="panel-body">' +
        '<form class="form-horizontal"><fieldset>' +
        '<div class="form-group">' +
        '<div class="col-xs-12">' +
        optionsString +
        '</div>' +
        '</div>' +
        '</fieldset></form>' +
        '</div>' + 
        '</div>';

    return result;
}

function prepareToggleQuestion(question) {
    var result = '<div class="panel panel-default">' + 
        '<div class="panel-heading">' + question.text + '</div>' +
        '<div class="panel-body">' +
        '<label class="switch">' + 
        '<input type="checkbox" class="answer-toggle" data-question-id="' + question._id + 
        '"><div class="slider round"></div>' + 
        '</label>' +
        '</div>' + 
        '</div>';

    return result;
}

function prepareResponse(question) {
    switch (question.questionType) {
        case QUESTION_SHORT:
            return displayShortAnswer(question);
        case QUESTION_MULTI:
            return displayMultiAnswer(question);
        case QUESTION_SINGLE:
            return displaySingleAnswer(question);
        case QUESTION_TOGGLE:
            return displayToggleAnswer(question);
        default:
            console.log('unknown question type');
            console.log(question);
        break;
    }
}

// display the results of a survey
function presentResponses(survey) {
    for (var i = 0; i < survey.questions.length; i++) {
        var response = prepareResponse(survey.questions[i]);
    }
}

function displayShortAnswer(question) {
    var questionId = question._id;

    var result = '<div class="panel panel-default">' + 
        '<div class="panel-heading">' + question.text + '</div>' +
        '<div class="panel-body">' + 'RESPONSES GO HERE' +
        '</div>' + 
        '</div>';

    return result;
}

function displayMultiAnswer(question) {
    var questionId = question._id;

    var result = '<div class="panel panel-default">' + 
        '<div class="panel-heading">' + question.text + '</div>' +
        '<div class="panel-body">' + 'RESPONSES GO HERE' +
        '</div>' + 
        '</div>';

    return result;
}

function displaySingleAnswer(question) {
    var questionId = question._id;

    var result = '<div class="panel panel-default">' + 
        '<div class="panel-heading">' + question.text + '</div>' +
        '<div class="panel-body">' + 'RESPONSES GO HERE' +
        '</div>' + 
        '</div>';

    return result;
}

function displayToggleAnswer(question) {
    var questionId = question._id;

    var result = '<div class="panel panel-default">' + 
        '<div class="panel-heading">' + question.text + '</div>' +
        '<div class="panel-body">' + 'RESPONSES GO HERE' +
        '</div>' + 
        '</div>';

    return result;
}

// hide all the rows
function hideRows() {
    $('#row-view-survey').hide();
    $('#row-create-survey').hide();
    $('#row-create-response').hide();
    $('#row-thank-you').hide();
    $('#row-view-response').hide();
}

$(document).ready(function() {
    var location = window.location.pathname.trim().toUpperCase().split('/');
    console.log(location);
    // start at index 1 because of the / that preceeds pathname
    switch (location[1]) {
        case "SURVEY":
            // hide the nav bar
            $('#row-nav').hide();
            hideRows();

            // get the survey referenced in the url for the user to fill out
            console.log('SURVEY');
            $.get("/api/survey/" + location[2], function(result) {
                console.log('got result from /api/survey');
                console.log(result);

                presentSurvey(result);
            });
        break;
    }
});

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

    if (optionText.length > 0) {
        var answerContainerId = $(this).data('answer-container');
        console.log(answerContainerId);
        var answerContainer = $('#' + answerContainerId);

        var questionId = $(this).data('question-id');

        answerContainer.append('<li class="answer_' + questionId + 
        '" data-question-id="' + questionId + 
        '" data-option-text="'+ optionText + 
        '">' + optionText + '</li>');

        optionInput.val('');
    } else {
        //todo: show user an error message that this cannot be empty
    }
});

$(document).on("click", "#btn-nav-create", function(e) {
    e.preventDefault();
    console.log('create survey');
    hideRows();
    $("#row-create-survey").show();
});

$(document).on("click", "#btn-nav-view", function(e) {
    e.preventDefault();
    console.log('view survey');
    hideRows();    
    $("#row-view-survey").show();
    getSurveys();
});

$(document).on("click", ".btn-view-survey", function(e) {
    e.preventDefault();
    console.log('btn-view-survey');
    console.log($(this).data('survey-id'));

    // hide rows
    hideRows();

    // clear the response list
    $('#response-list').html('');

    // show correct row
    $('#row-view-response').show();

    // get the survey object (for questions) and display the results
    $.get("/api/survey/" + $(this).data('survey-id'), function(result) {
        console.log('got result from /api/survey for view-survey');
        console.log(result);

        presentResponses(result);
    });
});

$(document).on("click", "#btn-save-response", function(e) {
    e.preventDefault();
    
    var answers = [];

    $('.answer-text').each(function(index, item) {
        var answer = {
            question: $(item).data('question-id'),
            value: $(item).val().trim()
        };

        answers.push(answer);
    });

    $('.answer-radio:checked').each(function(index, item) {
        var answer = {
            question: $(item).data('question-id'),
            value: $(item).val().trim()
        };

        answers.push(answer);
    });

    $('.answer-checkbox:checked').each(function(index, item) {
        var answer = {
            question: $(item).data('question-id'),
            value: $(item).val().trim()
        };

        answers.push(answer);
    });

    $('.answer-toggle').each(function(index, item) {
        var answer = {
            question: $(item).data('question-id'),
            value: $(item).val().trim()
        };

        answers.push(answer);
    });

    console.log('got answers');
    console.log(answers);

    var resp = {
        survey: window.location.pathname.trim().toUpperCase().split('/')[2],
        answers: answers
    }

    console.log(resp);

    $.post('/response', resp).then(function(result) {
        console.log('finished posting response');
        console.log(result);

        if (result.error) {
            //todo: display error
        } else {
            hideRows();
            $('#row-thank-you').show();
        }
    });
});