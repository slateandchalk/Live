const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.notifyUser = functions.firestore
    .document('archive/{archiveId}')
    .onCreate((snap, context) => {

        const message = snap.data();
        console.log(message);
        const userId = message.eventHead;

        console.log(userId);

        const db = admin.firestore();

        const userRef = db.collection('users').doc(userId);

        return userRef.get()
            .then(snapshop => snapshop.data())
            .then(user => {
                const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []
                if(!tokens.length){
                    throw new Error('User does not gave any tokens!');
                }

                const payload = {
                    notification: {
                        eventId: `${message.eventId}`,
                        title: `${message.eventName}`,
                        body: `${user.displayName} applied new event.`,
                        icon: `${user.photoURL}`,
                        approvedStatus: `${message.approvedStatus}`
                    }
                }

                return admin.messaging().sendToDevice(tokens, payload);
            })
            .catch(err => console.log(err))
    });

exports.notifyAdmin = functions.firestore
    .document('archive/{archiveId}')
    .onUpdate((change, context) => {

        const previousData = change.before.data();
        const message = change.after.data();
        console.log(message);
        const userId = message.createdBy;

        console.log(userId);

        if (message.approvedStatus === previousData.approvedStatus) return null;

        const db = admin.firestore();

        const userRef = db.collection('users').doc(userId);

        return userRef.get()
            .then(snapshop => snapshop.data())
            .then(user => {
                const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []
                if(!tokens.length){
                    throw new Error('User does not gave any tokens!');
                }

                const payload = {
                    notification: {
                        eventId: `${message.eventId}`,
                        title: `${message.eventName}`,
                        body: `${user.displayName} approved your event.`,
                        icon: `${user.photoURL}`,
                        approvedStatus: `${message.approvedStatus}`
                    }
                }

                return admin.messaging().sendToDevice(tokens, payload);
            })
            .catch(err => console.log(err))
    });