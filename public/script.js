var QUESTION_NUM = 0; //counter used to ensure each question get's the correct sort order
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
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  var id_token = googleUser.getAuthResponse().id_token;
  $.post("/validate", { token: id_token }).then(function(result) {
      console.log('/validate result=', result);
      if (result.userId) {
          console.log('valid user');

          //show ui to logged in user
          $(".sign-in-required").show();

          //todo: hide login button
          //todo: show logout button
      }
  });
}

// google's version of document.ready
google.setOnLoadCallback(googleReady);

function createQuestionText() {
    return '';
}

function createShortAnswer() {
    return '';
}

// call any google specific functions here
function googleReady() {
    console.log('google ready');    
}

function createQuestionShortAnswer() {
    var newQuestion = PANEL_HEAD;
    newQuestion += createQuestionText();
    newQuestion += createShortAnswer();
    newQuestion += PANEL_FOOT;
    
    QUESTION_NUM++;
    
    var result = $.parseHTML(newQuestion);
    console.log(result);

    $('#question-container').append(result);
}

function createQuestionSelectSingle() {
    
}

function createQuestionSelectMultiple() {
    
}

function createQuestionToggle() {
    
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
    console.log('short answer');
    createQuestionShortAnswer();
});

$(document).on("click", "#btn-question-multi", function(e) {
    console.log('multi choice');
});

$(document).on("click", "#btn-question-checkbox", function(e) {
    console.log('checkbox');
});

$(document).on("click", "#btn-question-toggle", function(e) {
    console.log('toggle');
});

$(document).on("click", "#btn-save-survey", function(e) {
    console.log('save survey');
});

$(document).on("click", "#btn-nav-create", function(e) {
    console.log('create survey');
    $("#row-create-survey").show();
    $("#row-view-survey").hide();
    
});

$(document).on("click", "#btn-nav-view", function(e) {
    console.log('view survey');
    $("#row-create-survey").hide();
    $("#row-view-survey").show();
});