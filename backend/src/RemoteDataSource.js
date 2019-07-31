require('dotenv').config();

const admin = require('firebase-admin');

let serviceAccount = require('../review-dash-board-firebase-adminsdk-je426-7618ae4918.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://review-dash-board.firebaseio.com"
});

admin.firestore.setLogFunction((log) => {
    console.log(log);
});

const reposRef = admin.firestore().collection('repos');

exports.saveRepository = function (repo) {
    console.log(`[saveRepository] - ${JSON.stringify(repo)}`)
    reposRef.doc(repo.name)
        .set(repo);
    console.log(`[saveRepository] - done`)
}

exports.insertPullRequests = function (prList, repoName) {
    console.log(`[insertPullRequests] - ${repoName}`)
    prList.forEach(pr => {
        reposRef.doc(repoName)
            .collection('pr')
            .doc("PR" + pr.id)
            .set(pr)
    })
}

exports.insertReviews = function (repoName, reviews, prId) {
    console.log(`[insertReviews] - ${prId}`)
    reviews.forEach(r => {
        reposRef.doc(repoName)
            .collection('review')
            .doc(prId + "-" + r.id)
            .set(r)
    })
}