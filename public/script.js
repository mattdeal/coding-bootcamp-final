var GOOGLE_USER_ID;

// keep all google functions here
function onGoogleSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

// might have to keep this one
function onGoogleSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  var id_token = googleUser.getAuthResponse().id_token;
  $.post("/validate", { token: id_token }).then(function(result) {
      console.log('/validate result', result);
      if (result.userId) {
          console.log('valid user');
          GOOGLE_USER_ID = result.userId;
      }
  });
}