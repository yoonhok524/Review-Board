require('dotenv').config();

const dataSource = require('./RemoteDataSource');
const githubDataSource = require('./GithubDataSource');

exports.sync = async function () {
    const stime = Date.now()
    const repos = getReadyRepos()

    for (const repo of repos) {
        dataSource.saveRepository(repo)

        // const prList = []
        // for (let page = 1; page < Number.MAX_SAFE_INTEGER; page++) {
        //     const _prList = await githubDataSource.getPullRequests(repo, page)
        //     console.log("PR List size: " + _prList.length)
        //     if (_prList.length == 0) {
        //         break;
        //     }

        //     dataSource.insertPullRequests(_prList, repo.name)
        //     Array.prototype.push.apply(prList, _prList)
        // }

        // // Save Pull Requests
        // for (const pr of prList) {
        //     /** 
        //      * 2. get Comments
        //      */
        //     pr.comments = await githubDataSource.getReviews(pr.commentsUrl)
        //     if (pr.comments.length != 0) {
        //         dataSource.insertReviews(repo.name, pr.comments, pr.id)
        //     }

        //     /**
        //      * 3. get Reviews
        //      */
        //     pr.reviews = await githubDataSource.getReviews(pr.reviewsUrl)
        //     if (pr.reviews.length != 0) {
        //         dataSource.insertReviews(repo.name, pr.reviews, pr.id)
        //     }
        // }
    }

    const etime = Date.now()
    console.log("[sync] done: " + (etime - stime) / 1000 + "sec")
}

function getReadyRepos() {
    return process.env.REPOS.split(",").map(n => {
        return {
            name: n,
            owner: {
                name: "seoul-sw-dev"
            }
        };
    });
}

// function buildResult(repo) {
//     if (repo.prList === undefined) {
//         return buildEmptyResult(repo)
//     }

//     const numOfPr = repo.prList.length
//     const numOfNoComment = repo.prList.filter(pr => pr.reviews.length == 0)
//         .map(pr => 1)
//         .reduce((s1, s2) => s1 + s2, 0)

//     return {
//         name: repo.name,
//         numOfPR: numOfPr,
//         numOfNoCommentPR: numOfNoComment,
//         repoUrl: `repository/${repo.name}`,
//         reviewRate: (numOfPr == 0) ? 0 : parseFloat(((numOfPr - numOfNoComment) / numOfPr * 100).toFixed(1))
//     }
// }

// function buildResultRange(repo, startDate, endDate) {
//     if (repo.prList === undefined) {
//         return buildEmptyResult(repo)
//     }

//     const numOfPr = repo.prList.length
//     const numOfNoComment = repo.prList.filter(pr => pr.reviews.length == 0)
//         .map(pr => 1)
//         .reduce((s1, s2) => s1 + s2, 0)

//     return {
//         name: repo.name,
//         numOfPR: numOfPr,
//         numOfNoCommentPR: numOfNoComment,
//         repoUrl: `repository/${repo.name}?startDate=${startDate}&endDate=${endDate}`,
//         reviewRate: (numOfPr == 0) ? 0 : parseFloat(((numOfPr - numOfNoComment) / numOfPr * 100).toFixed(1))
//     }
// }

// function buildEmptyResult(repo) {
//     return {
//         name: repo.name,
//         numOfPR: 0,
//         numOfNoCommentPR: 0,
//         reviewRate: 0
//     }
// }