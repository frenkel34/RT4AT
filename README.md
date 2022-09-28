# RT4AT
 This app allows you to go to [http://localhost:3003]/token/[scope]/[refresh token] and get an access token from Okta and check the scope to match your url. 

 - /token is a fixed route
 - [scope] is a single scope that you want to check for
 - [refresh token] is the actual refresh token

 The app will check: 
 1. If an AT token can be retrieved from the authorization server, if not an error is displayed
 2. If the scope in the url is included in the scopes of the access token
 3. If all thats clear it displays the AT and a big checkmark

#  Dorenv
 Required values in .env file:
 PORT=[the port you want to run on in localhost, default is 3000]
 ISSUER_URL=[the url of the authorization server as displayed in the meta data under issuer]
 CLIENT_SECRET=The client secret as found in Okta
 CLIENT_ID=The client id as found in Okta
 APP_URL=The url of the app which is also used as redirect URI

#  Notes
 - Use a native mobile app in Okta of you want to use Resource Owner Password Grant Flow
 - Make sure scopes are created in the authorization server
 - Make sure there is an access policy in the Authz server
 - Keep Redirect URI and Scopes consistent in your testing, a change in either will throw errors by design
