const admin = require('firebase-admin');
const util = require('util');

const app = admin.initializeApp();

return admin.firestore().collection("hospitalsMain").get()
    .then( (snapshot) => {
        snapshot.forEach( (doc) => {
            doc.ref.update({
                live: true,
            });
        });
    });