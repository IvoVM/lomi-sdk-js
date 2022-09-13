// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.9.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

firebase.initializeApp(
    {
        apiKey: "AIzaSyD_YVEOH2VN42gPX4344yG8sOI6mJsiaIM",
        authDomain: "lomi-35ab6.firebaseapp.com",
        databaseURL: "https://lomi-35ab6-default-rtdb.firebaseio.com",
        projectId: "lomi-35ab6",
        storageBucket: "lomi-35ab6.appspot.com",
        messagingSenderId: "394847830425",
        appId: "1:394847830425:web:3e0e2053d7ae3bf70f9308",
        measurementId: "G-QJ5VF5TCWZ"
        
      }
);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

