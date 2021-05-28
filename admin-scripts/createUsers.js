const admin = require('firebase-admin');
const util = require('util');
const SHA256 = require("crypto-js/sha256");
const crypto = require("crypto");
require("../tempUser");
const { v4: uuidv4 } = require('uuid');

// admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
// });

const app = admin.initializeApp();

// let userImportRecords = JSON.parse(JSON.stringify(userData));

console.log ( util.inspect(userData) + "\n\n\n" );

const makeUUID = (user) => {
    const test = uuidv4();
    admin.firestore().collection('userData').doc(test).get().then((doc) => {
        if (doc.exists) {
            console.log("Match found somehow, running uuid again");
            makeUUID();
        } else {
            let userImportRecord = {
                verif: SHA256(user.phoneNumber).toString(),
                hospital: user.hospital,
            };
            user.uid = test; 
            delete user.hospital;

            admin
                .auth()
                .importUsers([user])
                .then((results) => {
                    results.errors.forEach((indexedError) => {
                        console.log(`Error importing user ${indexedError.index}`);
                    });
                    console.log( util.inspect(userImportRecord));
                    //console.log(results.successCount + " users imported successfully, " + results.failureCount + " failed.");
                    admin.firestore().collection('userData').doc(user.uid).set(userImportRecord);
                })
                .catch((error) => {
                    console.log('Error importing users :', error);
                });
            //console.log("done");
        };
    }).catch((error) => {
        console.log("Error checking UUID match:", error);
    });
};

userData.forEach((user) => { makeUUID(user); });


// userData.forEach((user) => {
//     admin
//         .auth()
//         .getUserByPhoneNumber(user.phoneNumber)
//         .then((userRecord) => {
//             // See the UserRecord reference doc for the contents of userRecord.
//             //console.log(`Successfully fetched user data:  ${util.inspect(userRecord)}`);
//             const dbUser = {
//                 phoneNumber: SHA256(userRecord.phoneNumber).toString(),
//                 hospital: user.hospital,
//             };
//             admin.firestore().collection('userData').doc(userRecord.uid).set(dbUser);

//         })
//         .catch((error) => {
//             console.log('Error fetching user data:', error);
//         });
// });

