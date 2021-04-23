const admin = require('firebase-admin');
const privateKey = require('./private_key.json');

admin.initializeApp({
	credential: admin.credential.cert(privateKey)
});

function getDatabase() {
	return admin.firestore();
}

module.exports = getDatabase;