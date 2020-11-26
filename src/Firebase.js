import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

firebase.initializeApp({
	apiKey: "AIzaSyAIH7HjLMEiaoevBK8dmz52elvA-mgPBxE",
	authDomain: "titan-iot-1f4f1.firebaseapp.com",
	databaseURL: "https://titan-iot-1f4f1.firebaseio.com",
	projectId: "titan-iot-1f4f1",
	storageBucket: "titan-iot-1f4f1.appspot.com",
	messagingSenderId: "601444497990",
	appId: "1:601444497990:web:57a690e7fd54342db8a847",
	measurementId: "G-GQXE230YQ5"
});

export default firebase;
