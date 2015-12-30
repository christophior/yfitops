YFITOPS
===========

```
npm install
sudo easy_install pip
sudo pip install eyeD3
```

## Configuration
Before being able to run the script you will need to do some configuration.

To automate this configuration you can run
```
node app.js config
```
This will allow you to generate a **config.json** file in the config folder with your Spotify username, encrypted Spotify password (just so that it's not in plain text locally) and your download path.

If you want to do this manually that can also be done so but you will need to either leave your password in plain text or implement your own encryption/decryption.

I believe the default Music folder location in Mac's is **/Users/USERNAME/Music** so that might be a good location to use. I would recommend making sure you only keep your **config/config.json** file in your local machine.

** **to be able to use the script I believe you need to have a Spotify Premium account** **


## Running

Running on the current node version seems to not work properly but [Node v0.10.36](http://blog.nodejs.org/2015/01/26/node-v0-10-36-stable/) works fine. 

To download Node0.10.36 just go to [http://blog.nodejs.org/2015/01/26/node-v0-10-36-stable/](http://blog.nodejs.org/2015/01/26/node-v0-10-36-stable/) and download/install the appropriate version based on your machine.


Once you have your config file and Node 0.10.36 you can just do the following to start using the app

```
npm install
node app.js <spotify uri>
```

An output showing the progress of the app will be displayed. If an error occurs or the script fails to quit you can always use ctrl+c to kill the app.


## Spotify URIs
The application expects a Spotify URI at run time. To grab the URI of a song or playlist you can either right-click on a song or playlist in the Spotify app to copy the URI to your clipboard.

## Tips
A great way to make this app easier to use is to set an alias up in your .bash_profile. You can run the following:
```
vim ~/.bash_profile
```

This will open up an editor to edit your .bash_profile file, once open just add an alias line that follows the following format

alias command='original command to run'

Example:
```
alias download='node /Users/Chris/Development/yfitops/app.js'
```
After this just save and exit the editor by typing ESC followed by :wq and your new command will be saved. If you try running the new command (you might have to exit and re-enter your terminal) you should see the familar output from the app.

Ex.
```
download
# output
Please pass in a Spotify URI

# let's try that again
download spotify:track:2sNvitW3TxiTeC9xT9f2ZZ
# output
Given URI is a Spotify track...
	Downloading: Kygo - Firestone.mp3
```

# to prevent config file from being pushed
```
git update-index --assume-unchanged config/config.json
# to undo this
git update-index --no-assume-unchanged config/config.json
```

## Disclaimer
This application was created to gain knowledge in Node and Javascript.
Using the script is very likely to be a breach of the Spotify End User Agreement:

> Spotify respects intellectual property rights and expects you to do the same. This means, for example, that the following is not permitted: (a) Copying, reproducing, “ripping”, recording, or making available to the public any part of the Spotify Services or content delivered to you via the Spotify Services, or otherwise any making use of the Spotify Service which is not expressly permitted under these Terms
