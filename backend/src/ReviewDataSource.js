require('dotenv').config();

const util = require('util');
const logger = require('../common/logger')


const mysql = require('mysql');

const dbConn = mysql.createConnection({
    host: process.env.DB_HOST,
    post: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const query = util.promisify(dbConn.query).bind(dbConn);

var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

exports.insertRepository = function(repo) {
    const insertQuery = 'INSERT INTO repo (name, ownerName) VALUES (?,?) ON DUPLICATE KEY UPDATE name = VALUES(name)';
    insert(mysql.format(insertQuery, [repo.name, repo.owner.name]))
    logger.info(`insert - ${repo.name}`)
}

exports.insertPullRequests = function(prList, repoName) {
    const insertQuery = 'INSERT INTO pr (id, number, body, comments, commentsUrl, createdAt, reviews, reviewsUrl, title, url, repoName) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE id = VALUES(id)';
    prList.forEach(pr => {
        insert(mysql.format(insertQuery, [pr.id, pr.number, pr.body, pr.comments, pr.commentsUrl, pr.createdAt, pr.reviews, pr.reviewsUrl, pr.title, pr.url, repoName]))
    })
}

exports.insertReviews = function(reviews, prId) {
    const insertQuery = 'INSERT INTO review (id, userName, body, createdAt, url, prId) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE id = VALUES(id)';
    reviews.forEach(r => {
        insert(mysql.format(insertQuery, [`${prId}-${r.id}`, r.userName, r.body, r.createdAt, r.url, prId]))
    })
}

function insert(query) {
    pool.query(query, (err, response) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}

exports.getRepos = async function () {
    return await query("SELECT * FROM repo");
}

exports.getPRs = async function (repoName) {
    return await query(`SELECT * FROM pr WHERE repoName = '${repoName}'`)
}

exports.getPR = async function (prId) {
    return await query(`SELECT * FROM pr WHERE id = '${prId}'`)
}

exports.getPRsRange = async function (repoName, sDate, eDate) {
    return await query(`SELECT * FROM pr WHERE repoName = '${repoName}' AND createdAt >= '${sDate}' AND createdAt <= '${eDate}'`)
}

exports.getReviewsFromDb = async function (prId) {
    return await query(`SELECT * FROM review WHERE prId = '${prId}'`)
}

exports.getReviewsFromDbRange = async function (prId, sDate, eDate) {
    return await query(`SELECT * FROM review WHERE prId = '${prId}' AND createdAt >= '${sDate}' AND createdAt <= '${eDate}'`)
}

exports.increaseLikeCount = async function (prId, count) {
    await query(`UPDATE pr SET countOfGood = '${count}' WHERE id = '${prId}'`)
}