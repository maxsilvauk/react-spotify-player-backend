# NodeJS Spotify backend API
Backend NodeJS server for Spotify API and NativeScript App

# What is this?
This is NodeJS server which runs on express and serve (JSON) data for fronted mobile App built on NativeScript.
** URL to NativiScript app project

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
 
     
