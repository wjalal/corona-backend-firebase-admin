const admin = require('firebase-admin');
const app = admin.initializeApp();

function listAllUsers(nextPageToken) {
    // List batch of users, 1000 at a time.
    admin.auth().listUsers(1000, nextPageToken)
      .then(function(listUsersResult) {
        listUsersResult.users.forEach(function(userRecord) {
          console.log('user', userRecord.toJSON());
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
        }
      })
      .catch(function(error) {
        console.log('Error listing users:', error);
      });
  }
  // Start listing users from the beginning, 1000 at a time.
  listAllUsers();