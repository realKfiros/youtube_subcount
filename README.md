COMING SOON TO GOOGLE PLAY  
# YouTube subscription comparison
I've developed this app as a practice of HTTP requests.
YouTube has a perfect (API)[https://developers.google.com/youtube/v3/] for this use.  
You can use this app for everything that you want to do.  
The app also comes with (Firebase Cloud Firestore)[https://firebase.google.com/products/firestore/], for showing examples of comparisons.
The app was built using React Native.
## Config file
This project uses a config.js file with api keys, so if you want to develop your app from this app you need to change the code lr create a confing.js filr in the root of the app.  
### config.js file
```javascript
export default config = {
    key: string
    firebase: object
};
```
The key string should be your YouTube API key.  
The firebase object should be the configuration object of firebase and you use it to initiate Firebase on the app.
