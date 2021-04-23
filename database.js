const admin = require('firebase-admin');
let privateKey;
try {
	privateKey = require('./private_key.json');
} catch (error) {
    privateKey = JSON.parse(process.env.PRIVATE_KEY);
}

admin.initializeApp({
	credential: admin.credential.cert(privateKey)
});

function getDatabase() {
	return admin.firestore();
}

module.exports = getDatabase;