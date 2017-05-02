// log user out of the application (not google), and hide all items that require a session
function onGoogleSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');

        //hide ui items that require login
        $(".sign-in-required").hide();
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
      }
  });
}

// google's version of document.ready
google.setOnLoadCallback(googleReady);

// call any google specific functions here
function googleReady() {
    console.log('google ready');

    // if (gapi.auth2 && gapi.auth2.isSignedIn.get()) {
    //     console.log("gapi.auth2=", gapi.auth2);

    //     var profile = auth2.currentUser.get().getBasicProfile();
    //     console.log('ID: ' + profile.getId());
    //     console.log('Full Name: ' + profile.getName());
    //     console.log('Given Name: ' + profile.getGivenName());
    //     console.log('Family Name: ' + profile.getFamilyName());
    //     console.log('Image URL: ' + profile.getImageUrl());
    //     console.log('Email: ' + profile.getEmail());
    // } else {
    //     gapi.auth2.init();
    // }
}