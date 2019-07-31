const express = require('express');
const app = express();

const syncService = require('./src/SyncService')
const schedule = require('node-schedule')

console.log(`[START] ${Date().toString()}`);
// syncService.sync()
// var everyHourJob = schedule.scheduleJob('4 * * * *', function () {
//     console.log(`\n[Sync] start: ${Date().toString()}\n`)
//     syncService.sync()
// });


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    syncService.sync()
});




// app.get('/', function (req, res) {
//     console.log("[GET] /")
//     if (req.query.hasOwnProperty("startDate") && req.query.hasOwnProperty("endDate")) {
//         const startDate = req.query.startDate
//         const endDate = req.query.endDate

//         reposDao.getRange(startDate, endDate).then(results => sendResponse(res, results))
//     } else {
//         console.log("[GET] all")
//         reposDao.get().then(results => sendResponse(res, results))
//     }
// });

// app.get("/repository/:name/prs/:id", function (req, res) {
//     console.log("[PUT] /repository/:name/prs/:id")
//     const repoName = req.params.name
//     const prId = req.params.id * 1

//     repoDao.like(repoName, prId)
//         .then(results => sendResponse(res, results));
// });

// app.get('/repository/:name/prs', function (req, res) {
//     console.log("[GET] /repository/:name/prs")
//     const repository = req.params.name

//     if (req.query.hasOwnProperty("startDate") && req.query.hasOwnProperty("endDate")) {
//         const startDate = req.query.startDate
//         const endDate = req.query.endDate

//         repoDao.getRange(repository, startDate, endDate).then(results => sendResponse(res, results))
//     } else {
//         console.log("[GET] repository/" + req.params.name)
//         repoDao.get(repository).then(results => sendResponse(res, results))
//     }
// })

// function sendResponse(res, results) {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     res.status(200).send(results)
// }