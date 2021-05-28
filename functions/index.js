const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


exports.getUserHosp = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Only authicated users are allowed to request this data.'
        );
    } else {
        return admin.firestore().collection('userData').doc(context.auth.uid).get()
            .then((doc) => {
                return doc.data().hospital;
            })
            .catch((error) => {
                throw new functions.https.HttpsError(
                    'not-found',
                    (error + "\nFailed to find the requested user data.")
                );
            });
    };
});

exports.userExists = functions.https.onCall((data, context) => {
    return admin.firestore().collection('userData').where('verif', '==', data).get()
        .then((snap) => {
            if (snap.size > 0) return true;
            else return false;
        })
        .catch((error) => {
            throw new functions.https.HttpsError(
                'not-found',
                (error + "\nFailed to find the requested user data.")
            );
        });
});