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

## Tips
A great way to make this app easier to use is to set an alias up in your .bash_profile that also forces the app to run in v0.10.36 which will help prevent problems in the future. You can run the following
```
vim ~/.bash_profile
```

This will open up an editor to edit your .bash_profile file, once open just add an alias line that follows the following format

alias command='original command to run'

The command that we will be using is nvm run instead of node so we can specify the version along with the full path to the app.js file in this project. You can see what I added to my bash_profile below
```
alias download='nvm run 0.10.36 /Users/Chris/Development/yfitops/app.js'
```
After this just save and exit the editor by typing ESC followed by :wq and your new command will be saved. If you try running the new command (you might have to exit and reenter your terminal) you should see the familar output from the app.

Ex.
```
download
# output
Running node v0.10.36
Please pass in a Spotify URI

# let's try again
download spotify:track:2sNvitW3TxiTeC9xT9f2ZZ
# output
Running node v0.10.36
Given URI is a Spotify track...
	Downloading: Kygo - Firestone.mp3
```

## Disclaimer
This application was created to gain knowledge in Node and Javascript, I am not liable for what you do with this script. Please don't download content that you're not legally allowed to.