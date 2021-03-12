// // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
// const functions = require('firebase-functions')

// // The Firebase Admin SDK to access Firestore.
// const admin = require('firebase-admin')
// admin.initializeApp()

// // Take the text parameter passed to this HTTP endpoint and insert it into
// // Firestore under the path /messages/:documentId/original
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text
//   // Push the new message into Firestore using the Firebase Admin SDK.
//   const writeResult = await admin
//     .firestore()
//     .collection('messages')
//     .add({ original })
//   // Send back a message that we've successfully written the message
//   res.json({ result: `Message with ID: ${writeResult.id} added.` })
// })

// // Listens for new messages added to /messages/:documentId/original and creates an
// // uppercase version of the message to /messages/:documentId/uppercase
// exports.makeUppercase = functions.firestore
//   .document('/messages/{documentId}')
//   .onCreate((snap, context) => {
//     // Grab the current value of what was written to Firestore.
//     const original = snap.data().original

//     // Access the parameter `{documentId}` with `context.params`
//     functions.logger.log('Uppercasing', context.params.documentId, original)

//     const uppercase = original.toUpperCase()

//     // You must return a Promise when performing asynchronous tasks inside a Functions such as
//     // writing to Firestore.
//     // Setting an 'uppercase' field in Firestore document returns a Promise.
//     return snap.ref.set({ uppercase }, { merge: true })
//   })

// exports.addTestData = functions.https.onRequest(async (req, res) => {
//   const writeResult = await admin.firestore().collection('waitingUsers').add({
//     status: 'waiting',
//     roomId: '',
//     updatedat: admin.firestore.FieldValue.serverTimestamp(),
//   })
//   // Send back a message that we've successfully written the message
//   res.json({ result: `Message with ID: ${writeResult.id} added.` })
// })

// exports.matchingUsers = functions.firestore
//   .document('waitingUsers/{userID}')
//   .onWrite(async (change, context) => {
//     // Get an object with the current document value.
//     // If the document does not exist, it has been deleted.
//     // eslint-disable-next-line no-unused-vars
//     const document = change.after.exists ? change.after.data() : null
//     // const timeNow = admin.firestore.FieldValue.serverTimestamp()
//     const now = new Date()
//     const before5minUnix = now.getTime() - 1 * 60 * 1000 // ミリ秒なので(300秒*1000)
//     const before1min = new Date(before5minUnix)
//     // await admin.firestore().collection('users').add(document)
//     const latestDoc = await admin
//       .firestore()
//       .collection('waitingUsers')
//       .where('status', '==', 'waiting')
//       .orderBy('updatedat', 'desc')
//       // .startAt(admin.firestore.Timestamp.fromMillis(new Date().getTime()))
//       .endAt(admin.firestore.Timestamp.fromMillis(before1min))
//       .limit(10)
//       .get()
//     latestDoc.forEach((doc) => {
//       console.log(doc.data().updatedat)
//     })
//     // console.log(admin.firestore.FieldValue.serverTimestamp())
//     if (latestDoc.length < 4) {
//       return null
//     }

//     // Get an object with the previous document value (for update or delete)
//     // eslint-disable-next-line no-unused-vars
//     // const oldDocument = change.before.data()

//     // perform desired operations ...
//   })
