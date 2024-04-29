const { db } = require('./firebase.jsx');
const { collection, addDoc } = require('firebase/firestore');

const data = [
    {
        "event": "Park Cleanup Drive",
        "amount": 50,
        "starRating": 4.5,
        "numReviews": 22,
        "prize": "Free lunch from a local cafe",
        "status": "New"
      },
      {
        "event": "Local Library Organization",
        "amount": 30,
        "starRating": 4.0,
        "numReviews": 18,
        "prize": "Book vouchers",
        "status": "Not new"
      },
      {
        "event": "Senior Tech Help Day",
        "amount": 40,
        "starRating": 4.8,
        "numReviews": 15,
        "prize": "Coffee shop gift card",
        "status": "New"
      },
      {
        "event": "Community Garden Tending",
        "amount": 35,
        "starRating": 4.2,
        "numReviews": 12,
        "prize": "Gardening supplies gift pack",
        "status": "Not new"
      },
      {
        "event": "Neighborhood Beautification",
        "amount": 45,
        "starRating": 4.7,
        "numReviews": 25,
        "prize": "Local store discount coupons",
        "status": "New"
      }
];

async function addBountiesToFirestore(bountyDataArray) {
    const addedDocs = [];
    for (const bountyData of bountyDataArray) {
        try {
            const docRef = await addDoc(collection(db, "bounties"), bountyData);
            console.log("Document written with ID: ", docRef.id);
            addedDocs.push({ id: docRef.id, ...bountyData });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    return addedDocs;
}

// Call the function to add data
addBountiesToFirestore(data)
    .then(addedDocs => console.log('Added documents:', addedDocs))
    .catch(e => console.error('Error in adding documents:', e));