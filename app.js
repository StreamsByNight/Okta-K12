const oktaSignIn = new OktaSignIn({
  baseUrl: 'https://integrator-4230027.okta.com',
  clientId: '0oa13a39wvaIasHaV698',
  redirectUri: 'https://streamsbynight.github.io/Okta-K12/',
  authParams: {
    issuer: 'https://integrator-4230027.okta.com',
    scopes: ['openid', 'profile', 'email'],
    pkce: true
  },
  i18n: {
    en: {
      'primaryauth.title': ' ',
      'primaryauth.submit': 'LOG IN'
    }
  }
});

if (oktaSignIn.authClient.isLoginRedirect()) {
  oktaSignIn.authClient.token.parseFromUrl()
    .then(function(tokens) {
      oktaSignIn.authClient.tokenManager.setTokens(tokens);
      showWelcomePage();
    })
    .catch(function(err) {
      console.error('Token parsing error:', err);
    });
} else {
  oktaSignIn.authClient.session.get()
    .then(function(res) {
      if (res.status === 'ACTIVE') {
        showWelcomePage();
      } else {
        showLoginPage();
      }
    });
}

function showLoginPage() {
  document.getElementById('welcome-container').style.display = 'none';
  document.getElementById('content-wrapper').style.display = 'flex';
  
  oktaSignIn.showSignInToGetTokens({
    el: '#okta-login-container'
  }).then(function(tokens) {
    oktaSignIn.authClient.tokenManager.setTokens(tokens);
    oktaSignIn.remove();
    showWelcomePage();
  }).catch(function(err) {
    console.error('Sign-in widget execution error:', err);
  });
}

function showWelcomePage() {
  document.getElementById('content-wrapper').style.display = 'none';
  document.getElementById('welcome-container').style.display = 'block';
}

document.getElementById('logout-btn').addEventListener('click', function() {
  oktaSignIn.authClient.signOut();
});
