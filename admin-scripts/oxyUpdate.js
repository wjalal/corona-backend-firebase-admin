const admin = require('firebase-admin');
const util = require('util');

const app = admin.initializeApp();

const FieldValue = admin.firestore.FieldValue;

return admin.firestore().collection("hospitalsMain").get()
    .then( (snapshot) => {
        snapshot.forEach( (doc) => {
            doc.ref.update({
                oxygencylinder: doc.data().oxygen,
                oxygen: FieldValue.delete(),
            });
        });
    });