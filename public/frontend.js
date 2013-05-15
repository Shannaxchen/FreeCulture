
// This code will be executed when the page finishes loading
window.addEventListener('load', function(){
	var currentUser = null;
	var signinLink = document.getElementById('signin');
	var signoutLink = document.getElementById('signout');


	if(signoutLink && signinLink){

	// You need to call navigator.id.watch for login/logout, and current user events. 
	navigator.id.watch({
	  loggedInUser: currentUser,
	  onlogin: function(assertion) {
	    // A user has logged in! Here you need to:
	    // 1. Send the assertion to your backend for verification and to create a session.
	    // 2. Update your UI.
	    $.ajax({ /* <-- This example uses jQuery, but you can use whatever you'd like */
	      type: 'POST',
	      url: '/auth/login', // This is a URL on your website.
	      data: {assertion: assertion},
	      success: function(res, status, xhr) { if(res == 'yes') {console.log(res);  } else {console.log("no");} },
	      error: function(xhr, status, err) {
		navigator.id.logout();
		alert("Login failure: " + err);
		console.log(status);
	      }
	    });
	  },
	  onlogout: function() {
	    // A user has logged out! Here you need to:
	    // Tear down the user's session by redirecting the user or making a call to your backend.
	    // Also, make sure loggedInUser will get set to null on the next page load.
	    // (That's a literal JavaScript null. Not false, 0, or undefined. null.)
	    $.ajax({
	      type: 'POST',
	      url: '/auth/logout', // This is a URL on your website.
	      success: function(res, status, xhr) { console.log("log out yeah"); window.location.reload(); },
	      error: function(xhr, status, err) { alert("Logout failure: " + err); }
	    });

	  }
	});

	}
	else if(signoutLink){
	// You need to call navigator.id.watch for login/logout, and current user events. 
	navigator.id.watch({
	  loggedInUser: currentUser,
	  onlogin: function(assertion) {
	  },
	  onlogout: function() {
	    // A user has logged out! Here you need to:
	    // Tear down the user's session by redirecting the user or making a call to your backend.
	    // Also, make sure loggedInUser will get set to null on the next page load.
	    // (That's a literal JavaScript null. Not false, 0, or undefined. null.)
	    $.ajax({
	      type: 'POST',
	      url: '/auth/logout', // This is a URL on your website.
	      success: function(res, status, xhr) { console.log("log out yeah"); window.location.reload(); },
	      error: function(xhr, status, err) { alert("Logout failure: " + err); }
	    });
	  }
	});

	}



	if (signinLink) {
	  signinLink.onclick = function() { navigator.id.request(); };
	}

	if (signoutLink) {
	  signoutLink.onclick = function() { navigator.id.logout(); };
	}



        
}, false);
