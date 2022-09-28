require('dotenv').config();

const express 		= require('express');
const handlebars  	= require('express-handlebars');
const axios 		= require('axios');
const bodyParser 	= require("body-parser");
const jwt 			= require('express-jwt');
const jwtScope 		= require('express-jwt-scope');
const qs			= require('qs');

var app = express();

// USe body post parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set static folder
app.use(express.static('public'));


// SOME NICE LITTLE HANDLEBARS HELPERS IN CASE WE NEED M
app.engine('handlebars', handlebars.engine({ 
	defaultLayout: 'index',
	helpers: {
    	toJSON : function(object) {
      		return JSON.stringify(object)
    	},
    	ifEq : function(arg1, arg2, options) {
    		return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
		},
    	ifNotEq : function(arg1, arg2, options) {
    		return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
		},
		jwt: function (token){
        var atob = require('atob');
        if (token != null) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.stringify(JSON.parse(atob(base64)), undefined, '\t');
        } else {
            return "Invalid or empty token was parsed"
        }
    }
	}
}));
app.set('view engine', 'handlebars');

// ROUTING
app.get('/', (req, res) => {
	res.render('main', {layout : 'index'});
});

function getAccessToken(refresh_token, scopes) {
	var data = qs.stringify({
	  'grant_type': 'refresh_token',
	  'redirect_uri': process.env.APP_URL,
	  'scope': scopes,
	  'refresh_token': refresh_token 
	});

	var config = {
	  method: 'post',
	  url: process.env.ISSUER_URL + '/v1/token',
	  headers: { 
	    'Accept': 'application/json', 
	    'Authorization': 'Basic' + new Buffer(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64'), 
	    'Content-Type': 'application/x-www-form-urlencoded'
	  },
	  data : data
	};
  return axios(config).catch(function (error) {
  	console.error('error happened')
  });
}

function parseJwt (token) {
    try {
    	return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    } catch (error) {
    	console.error('errors are not nice!');
  }
    
}

app.get('/token/:scp/:token', (req, res) => {
	let refresh_token = req.params.token;
	let resourceScope = req.params.scp;

	if (refresh_token) {
		console.log('refresh_token detected');
		(async () => {
		   var tokenResponse = await getAccessToken(refresh_token, resourceScope);
			 console.log(tokenResponse)
			 if (tokenResponse && tokenResponse.data.access_token) {
				var access_token = tokenResponse.data.access_token;
				
				var tokenScope = tokenResponse.data.scope
				if (tokenScope) {
						result = tokenScope.includes(resourceScope);
						
					} else {
						result = "error"
					}
				console.log(result);
				console.log(access_token)
				console.log(resourceScope);
				console.log(tokenScope);

				res.render('verifytoken', {layout : 'index', access_token: access_token, resourceScope: resourceScope, tokenScope: tokenScope, result: result});				
			} else {
				res.render('verifytoken', {layout : 'index', access_token: access_token, resourceScope: resourceScope, tokenScope: tokenScope, result: 'error'});				
			}
		})()
	}
});

// START APP
app.listen(process.env.PORT || 3000, function () {
  console.log('App started');
});












