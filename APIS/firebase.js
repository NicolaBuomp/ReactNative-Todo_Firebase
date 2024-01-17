const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp({
    credential: cert('./firebase-key.json')
})

const db = getFirestore();

module.exports = {
    db
}