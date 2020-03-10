const apiId = 'ewuk0tjwpj';
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`;

export const authConfig = {
  domain: 'dev-rf-u05fp.auth0.com',
  clientId: 'qQAsD4aGaOdg58ovHdQ7WWIRf4KTtdcg',
  callbackUrlWeb: 'http://localhost:3000/callback',
  callbackUrliOS:
    'org.reactjs.native.example.client://dev-rf-u05fp.auth0.com/ios/org.reactjs.native.example.client/callback',
  callbackAndroid:
    'com.client://dev-rf-u05fp.auth0.com/android/com.client/callback',
};
