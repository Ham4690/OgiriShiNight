// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions')

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin')
admin.initializeApp()
const waitingUsersRef = admin.firestore().collection('waitingUsers')

// // Take the text parameter passed to this HTTP endpoint and insert it into
// // Firestore under the path /messages/:documentId/original
// exports.addMessage = functions
//   .region('asia-northeast2')
//   .https.onRequest(async (req, res) => {
//     // Grab the text parameter.
//     const original = req.query.text
//     // Push the new message into Firestore using the Firebase Admin SDK.
//     const writeResult = await admin
//       .firestore()
//       .collection('messages')
//       .add({ original })
//     // Send back a message that we've successfully written the message
//     res.json({ result: `Message with ID: ${writeResult.id} added.` })
//   })

// // Listens for new messages added to /messages/:documentId/original and creates an
// // uppercase version of the message to /messages/:documentId/uppercase
// exports.makeUppercase = functions
//   .region('asia-northeast2')
//   .firestore.document('/messages/{documentId}')
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

// exports.addTestData = functions
//   .region('asia-northeast2')
//   .https.onRequest(async (req, res) => {
//     const writeResult = await waitingUsersRef.add({
//       displayName: 'user1',
//       photoURL:
//         'https://lh3.googleusercontent.com/a-/AOh14GiRnRWsL3wTOSs7z-4tYxBYYshrWH8fE-87c8Oo=s96-c',
//       status: 'waiting',
//       roomId: '',
//       waitingNum: 0,
//       userNum: 0,
//       updatedat: admin.firestore.FieldValue.serverTimestamp(),
//     })
//     // Send back a message that we've successfully written the message
//     res.json({ result: `Message with ID: ${writeResult.id} added.` })
//   })

exports.matchingUsers = functions
  .region('asia-northeast2')
  .firestore.document('waitingUsers/{userID}')
  .onWrite(async () => {
    // const document = change.after.exists ? change.after.data() : null
    // const timeNow = admin.firestore.FieldValue.serverTimestamp()
    const now = new Date()
    const before5minUnix = now.getTime() - 1 * 60 * 1000 // ミリ秒なので(300秒*1000)
    const before1min = new Date(before5minUnix)
    // await admin.firestore().collection('users').add(document)
    const latestDocs = await admin
      .firestore()
      .collection('waitingUsers')
      .where('status', '==', 'waiting')
      .orderBy('updatedat', 'desc')
      // .startAt(admin.firestore.Timestamp.fromMillis(new Date().getTime()))
      .endAt(admin.firestore.Timestamp.fromMillis(before1min))
      .limit(4)
      .get()
    // latestDocs.forEach((doc) => {
    //   console.log(doc.id)
    // })

    if (latestDocs.size < 4) {
      latestDocs.forEach((doc) => {
        waitingUsersRef.doc(doc.id).update({
          waitingNum: latestDocs.size,
        })
      })
      return null
    }

    return admin
      .firestore()
      .runTransaction(async (transaction) => {
        // 取得
        const _waitingDocs = latestDocs.docs.map(async (doc) => {
          // console.log(doc)
          const sameDoc = await transaction.get(waitingUsersRef.doc(doc.id))
          if (!sameDoc.exists) {
            // eslint-disable-next-line no-throw-literal
            throw 'Document does not exist!'
          }
          return sameDoc
        })
        const waitingDocs = await Promise.all(_waitingDocs)
        // waitingUsers書き込み
        const roomId = String(Math.floor(Math.random() * 900000) + 100000)
        // const roomId = '475718'
        waitingDocs.forEach((doc) => {
          if (doc.data().status === 'waiting') {
            transaction.update(waitingUsersRef.doc(doc.id), {
              status: 'matched',
              roomId,
            })
          } else {
            // eslint-disable-next-line no-throw-literal
            throw 'status of Document changed.'
          }
        })
        return { waitingDocs, roomId }
      })
      .then(async ({ waitingDocs, roomId }) => {
        // お題選び
        console.log('Transaction successfully committed!')
        const themesRef = admin.firestore().collection('themes')
        let themeNum = 0
        await themesRef
          .orderBy('themeid', 'desc')
          .limit(1)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              const themeData = doc.data()
              themeNum = themeData.themeid
              console.log('theme is ', doc.data())
            })
          })
        const randNum = Math.floor(Math.random() * (themeNum + 1))
        let themeName = 'no theme'
        console.log('randNum', randNum)
        await themesRef
          .where('themeid', '==', randNum)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              console.log('success : ', doc.data())
              themeName = doc.data().theme
            })
          })
          .catch((error) => {
            console.log('error : ' + error)
          })
        console.log('themeName:', themeName)
        // 部屋作成
        console.log('roomId: ', roomId)
        const roomsRef = admin.firestore().collection('rooms')
        await roomsRef.doc(roomId).set({
          answer: ['', '', '', ''],
          isEmpty: false,
          points: [0, 0, 0, 0],
          theme: themeName,
          scored: [false, false, false, false],
        })
        // 部屋番号が被った時用にusers削除
        const usersSnapshot = await roomsRef
          .doc(roomId)
          .collection('users')
          .get()
        if (usersSnapshot.size !== 0) {
          const _targetDeleteDocs = usersSnapshot.docs.map(async (doc) => {
            const targetDeleteDoc = await roomsRef
              .doc(roomId)
              .collection('users')
              .doc(doc.id)
              .delete()
            console.log('delete document:', doc.id)
            return targetDeleteDoc
          })
          await Promise.all(_targetDeleteDocs)
        }
        // users登録
        waitingDocs.forEach((doc, index) => {
          roomsRef.doc(roomId).collection('users').doc(doc.id).set({
            displayName: doc.data().displayName,
            photoURL: doc.data().photoURL,
            userNum: index,
          })
          waitingUsersRef.doc(doc.id).update({
            userNum: index,
            status: 'enableJoinRoom',
          })
          console.log('document successfully update: ', doc.id)
        })
      })
      .catch((error) => {
        console.log('Transaction failed: ', error)
      })

    // Get an object with the previous document value (for update or delete)
    // eslint-disable-next-line no-unused-vars
    // const oldDocument = change.before.data()

    // perform desired operations ...
  })
