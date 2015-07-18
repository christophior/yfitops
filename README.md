YFITOPS
===========

## Configuration
Before being able to run the script you will need to do some configuration.

At the root of the project there is a **config.json** file present that needs to be filled out, the information necessary will be:

* username (Spotify username)
* password (Spotify password)
* path (location where tracks will be downloaded; e.g. /Users/Chris/Music)

I believe the default Music folder location in Mac's is **/Users/USERNAME/Music** so that might be a good location to use. I would recommend making sure you only keep your **config.json** file in your local machine.

** **to be able to use the script I believe you need to have a Spotify Premium account** **


## Running

Running on the current node version seems to not work properly but Node v0.10.36 seems to work. To install different versions of Node I would recommend NVM. To get NVM you can run the following
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
```

Once installed you can run the following to install Node v0.10.36
```
nvm install 0.10.36
nvm use 0.10.36

# install modules and run application
npm install
node app.js <spotify uri>
```

An output showing the progress of the app will be displayed. If an error occurs or the script fails to quit you can always use ctrl+c to kill the app.


## Spotify URIs
The application expects a Spotify URI at run time. To grab the URI of a song or playlist you can either right-click on a song or playlist in the Spotify app to copy the URI to your clipboard.


## Disclaimer
This application was created to gain knowledge in Node and Javascript, I am not liable for what you do with this script. Please don't download content that you're not legally allowed to.