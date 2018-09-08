# NodeJS Spotify backend API
Backend NodeJS server for Spotify API and NativeScript App

# What is this?
This is NodeJS server which runs on express and serve (JSON) data for fronted mobile App built on NativeScript.
** URL to NativiScript app project
Project came with idea to controll music (play, skip, volume etc.) from multiple devices at any time. For instance, from tablet mounted on the wall or small Arduino WiFi capable controller (as small low power wifi remote). There is no similar project with similar idea so I had to build my own. I did use React project from https://github.com/mpj/oauth-bridge-template and modify it to fit my needs. 

# What does it do?
App communicates with Spotify API services and gain access to their service. It lays between (middle man) Spotify servers and frontend app. 
Frontend app can be any app or *device* which support application/json data requests and responses. From Nativescript to Arduino, RPi etc.
It gives you full (what is built in) controll over your music.

# Features
 - Pause
 - Play
 - Next/Prev
 - What is playing displayed and refreshed in realtime*
 
 # How to use it?
 
 Server serves express app on port 8888 and it waits for json POST and GET requests from frontend app or device. 
 Requests are simple json objects sent in header. 
 
 # How does it do?
 Backend communicates with Spotify API, authenticate with API using SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET as credentials. ID and Secret can be stored in local linux session or server.js file. I am using in file settings, and yes there is example for session storage on linux system. After starting the server it will tell you to 
open url in your browser ex. http://yr-domain.com/login 
It will ask you to approwe connection with app. 

Server gets OAuth access_token and refresh_token. Refresh token is used to get new fresh access_token and server takes care of that for you. There is a cronjob which ping spotify server every 55 minutes and ask for new refreshed token. Once when token is received, it is stored in lacal memory and used in server app. To stop, just terminate nodejs server app. 

 # Store settings in Linux terminal
 
    export SPOTIFY_CLIENT_ID=XXXX
    export SPOTIFY_CLIENT_SECRET=YYYY
    
ID and Secret you get from https://developer.spotify.com/ You have to create new App under Dashboard and click Create Client ID. How to procedure can be found here: https://www.youtube.com/watch?v=f5OLDvwP-Ug 
Make sure to add callback URLs in spotify app dashboard. Example of url: http://your-domain.com:8888/callback
It will not work without this. Watch provided video and you will be fine.
    
# Run server

    npm install
    npm start
 
 *Optional* 
 
 Run your server forever without having to login in to terminal and run it. (it runs in background and restart in case or errors)
 Make sure to install forever first. (for more details and options: https://www.npmjs.com/package/forever )
 
    $ [sudo] npm install forever -g
    
 Start server with forever:
 
    forever start -a -l forever.log -o out.log -e err.log server.js 
 
 # Dependencies  
 You may have to install some libraryes. Here is full dependencies list: 
 
     "body-parser": "^1.18.3",
     "cron": "^1.4.1",
     "express": "^4.15.4",
     "node-schedule": "^1.3.0",
     "querystring": "^0.2.0",
     "request": "^2.81.0"
  
    
# What next?

Fork it, add more features, contribute, report problems, feel free to use it. 


