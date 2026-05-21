// Initialize Custom Okta Engine Context utilizing your instance URL
const oktaSignIn = new OktaSignIn({
  baseUrl: 'https://integrator-4230027.okta.com', 
  clientId: '0oa13a39wvaIasHaV698', // <-- REPLACE THIS WITH YOUR OIDC CLIENT ID
  redirectUri: window.location.origin + window.location.pathname, 
  
  authParams: {
    issuer: 'https://integrator-4230027.okta.com/oauth2/default', 
    scopes: ['openid', 'profile', 'email'],
    pkce: true
  },
  
  i18n: {
    en: {
      'primaryauth.title': ' ',       // Suppresses default header to match design framework
      'primaryauth.submit': 'LOG IN'  // Sets CTA label text behavior
    }
  }
});

// Evaluate identity handshake return parameters from address routing tokens
if (oktaSignIn.authClient.isLoginRedirect()) {
  oktaSignIn.authClient.token.parseFromUrl()
    .then(tokens => {
      oktaSignIn.authClient.tokenManager.setTokens(tokens);
      showWelcomePage();
    })
    .catch(err => {
      console.error('URL parse configuration verification context failure:', err);
    });
} else {
  oktaSignIn.authClient.session.get()
    .then(res => {
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
  }).then(tokens => {
    oktaSignIn.authClient.tokenManager.setTokens(tokens);
    oktaSignIn.remove();
    showWelcomePage();
  }).catch(err => {
    console.error('Sign-in interaction processing errors caught:', err);
  });
}

function showWelcomePage() {
  document.getElementById('content-wrapper').style.display = 'none';
  document.getElementById('welcome-container').style.display = 'block';
}

document.getElementById('logout-btn').addEventListener('click', () => {
  oktaSignIn.authClient.signOut();
});