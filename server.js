// Media controller - Server
// Version: 1.01
// Forked from:    and modified with added features
let express = require('express')
let bodyParser = require('body-parser')
let request = require('request')
let querystring = require('querystring')
//var schedule = require('node-schedule');

var cron = require('cron');
// runs every hour (every 55 minutes) to refresh tokens
var cronJob = cron.job("0 */55 * * * *", function () {
  // perform operation e.g. GET request http.get() etc.
  if (loginInitiated) {
    funcRefreshToken();
    console.info('Token refresh completed');
    console.log("New access  token: " + access_token);
  } else {
    console.info('Error: You need to login to Spotify');
  } 
  
});
cronJob.start(); 

let app = express()
// parse JSON
app.use(bodyParser.json());
// CONFIG
const serverAddr = 'http://YOUR_DOMAIN';  // no slash at the end!
var SPOTIFY_CLIENT_ID = 'ENTER_YOUR_ID';
var SPOTIFY_CLIENT_SECRET = 'ENTER_YOUR_SECRET';
let access_token = ""; // Keeps valid token in memory
let refresh_token = ""; // known as permanent token which does not expire 
let expires_in = 3600;
let loginInitiated = false;

let redirect_uri =
  process.env.REDIRECT_URI ||
  serverAddr + ':8888/callback'


app.get('/login', function (req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      // client_id: process.env.SPOTIFY_CLIENT_ID, //9c70f9f7efbc41e59d8dd35c66d0131b  
      client_id: SPOTIFY_CLIENT_ID,
      scope: 'user-read-currently-playing user-modify-playback-state user-read-private user-read-email',
      redirect_uri
    }))
})

app.get('/callback', function (req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer( 
        // process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET // uncomment if you want to use local Linux storage for secrets
        SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET // comment this if you using lines above
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function (error, response, body) {
    // Set all tokens and expiration time
    access_token = body.access_token;
    expires_in = body.expires_in;
    refresh_token = body.refresh_token;

    // Redirection disabled, Enable if you need it for something else
    // let uri = process.env.FRONTEND_URI || serverAddr + ':3000'
    // res.redirect(uri + '?access_token=' + access_token)  

    res.json({
      "access token": access_token,
      "refresh token": refresh_token,
      "expires in": expires_in
    });

    loginInitiated = true; // enables timer for Token refresh
    // res.json({ "login success": "yes" });
  })
})

// refresh access token with refresh token available from Login procedure
function funcRefreshToken() {
  //let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      //code: code,
      refresh_token: refresh_token, // my saved refresh token
      redirect_uri,
      grant_type: 'refresh_token'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function (error, response, body) {
    // Set all NEW tokens and expiration time
    access_token = body.access_token;
    expires_in = body.expires_in;
  })
}
 
//######## JSON GET - receives commands from client App
app.post('/komande', function (req, res) {
  if (loginInitiated) {
    console.log("Request:" + req.body.komanda + "   Method: " + req.body.tip); // show received JSON data in terminal
    // res.send({ "login": "Please login to Spotify first" });    // echo the result back to sender - uncomment if you want to listen responses on client side
    var options = {
      method: req.body.tip, //PUT, POST, GET..
      url: 'https://api.spotify.com/v1/me/player/' + req.body.komanda,
      headers: {
        scope: 'user-read-currently-playing user-modify-playback-state user-read-private user-read-email', // extend list if you need more options
        authorization: 'Bearer ' + access_token,
        'content-type': 'application/json'
      },
      body: ''
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      // display console output for What is playing or Volume change etc.
      if (req.body.komanda !== "currently-playing") {
        console.log(body);        
      }
      res.json(body);
      //###################################################################
      // res.setHeader('Content-Type', 'application/json');
      // res.json(JSON.stringify({ login: "Please login to Spotify first" }, null, 3));
      //################################################################### 
      // res.setHeader('Content-Type', 'application/json');
      // res.send(JSON.stringify({
      // error : {
      //     status : 403,
      //     message : "hooopala"
      //   }
      // })); 

    });

    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(JSON.stringify({
        login: "Please login to Spotify"
      }, null, 3));
      console.log("Err: Please login to Spotify first");
    }

});

// Manual refresh - testing - Leave disabled
// app.get('/refresh', function (req, res) {
//   console.log("Saved access token  token: "+access_token);
//   console.log("Saved refresh token: "+refresh_token);
//   //let code = req.query.code || null
//   let authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     form: {
//       //code: code,
//       refresh_token: refresh_token, // my saved refresh token
//       redirect_uri,
//       grant_type: 'refresh_token'
//     },
//     headers: {
//       'Authorization': 'Basic ' + (new Buffer(          
//         SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET  
//       ).toString('base64'))
//     },
//     json: true
//   }
//   request.post(authOptions, function (error, response, body) {
//     // Set all NEW tokens and expiration time
//     access_token = body.access_token;
//     expires_in = body.expires_in;
//     // refresh token never expires, I do not need to reset it.. 
//     // if(!refresh_token) {
//     //   refresh_token = body.refresh_token; 
//     // }  
//     res.json({
//       "access token": access_token,
//       "refresh token": refresh_token,
//       "expires in": expires_in,
//       "new request processed": "yes"
//     });
//     // res.json({ "generisano": "da" });
//   })
// })


// ########### Next song - Example of static endpoint.
// app.get('/next', function(req, res) {
//   var options = { method: 'POST',
//   url: 'https://api.spotify.com/v1/me/player/next',
//   headers: 
//    { 
//      scope: 'user-read-currently-playing user-modify-playback-state user-read-private user-read-email',
//      authorization: 'Bearer ' + access_token,
//      'content-type': 'application/json' },
//      body: '' };

//     request(options, function (error, response, body) {
//       res.json({"status": "ok"}); // echo ok to browser page
//         if (error) throw new Error(error);
//         //console.log(body);
//     });
// }) 

// Server serve settings
let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go to ${serverAddr}/login to initiate authentication flow.`)
app.listen(port)
