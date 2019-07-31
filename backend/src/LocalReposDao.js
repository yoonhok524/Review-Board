require('dotenv').config();
const logger = require('../common/logger')
const reviewDataSource = require('./ReviewDataSource');

const axios = require('axios');
const instance = axios.create({
    baseURL: process.env.GITHUB_URL,
    timeout: 100000,
    headers: { 'Authorization': 'Basic ' + Buffer.from(`${process.env.GITHUB_KEY}`).toString('base64') }
});

exports.get = async function () {
    logger.info("[GET] all")
    const stime = Date.now()
    const result = {
        repos: []
    }

    const repos = await reviewDataSource.getRepos()
    for (const r of repos) {
        r.prList = await reviewDataSource.getPRs(r.name)
        for (const p of r.prList) {
            p.reviews = await reviewDataSource.getReviewsFromDb(p.id)
        }

        result.repos.push(buildResult(r))
    }

    const etime = Date.now()
    logger.info("\tdone: " + (etime - stime) / 1000 + "sec")

    return result
}

exports.getRange = async function (startDate, endDate) {
    logger.info(`[GET] ${startDate} ~ ${endDate}`)
    const stime = Date.now()
    const result = {
        startDate: startDate,
        endDate: endDate,
        repos: []
    }

    const sDate = Date.parse(startDate)
    const eDate = Date.parse(endDate)

    const repos = await reviewDataSource.getRepos()
    for (const r of repos) {
        r.prList = await reviewDataSource.getPRsRange(r.name, sDate, eDate)
        for (const p of r.prList) {
            p.reviews = await reviewDataSource.getReviewsFromDbRange(p.id, sDate, eDate)
        }

        const rrr = buildResultRange(r, startDate, endDate)
        result.repos.push(rrr)
    }

    const etime = Date.now()
    logger.info("\tdone: " + (etime - stime) / 1000 + "sec")

    return result
}

exports.sync = async function () {
    const stime = Date.now()
    const repos = getReadyRepos()

    for (const repo of repos) {
        reviewDataSource.insertRepository(repo)

        const prList = []
        for (let page = 1; page < Number.MAX_SAFE_INTEGER; page++) {
            const _prList = await getPullRequests(repo, page)
            if (_prList.length == 0) {
                break;
            }

            reviewDataSource.insertPullRequests(_prList, repo.name)
            Array.prototype.push.apply(prList, _prList)
        }

        // Save Pull Requests
        for (const pr of prList) {
            /** 
             * 2. get Comments
             */
            pr.comments = await getReviews(pr.commentsUrl)
            if (pr.comments.length != 0) {
                reviewDataSource.insertReviews(pr.comments, pr.id)
            }

            /**
             * 3. get Reviews
             */
            pr.reviews = await getReviews(pr.reviewsUrl)
            if (pr.reviews.length != 0) {
                reviewDataSource.insertReviews(pr.reviews, pr.id)
            }
        }
    }

    const etime = Date.now()
    logger.info("[sync] done: " + (etime - stime) / 1000 + "sec")
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

async function getPullRequests(repo, page) {
    const prResp = await instance.get('/repos/' + repo.owner.name + '/' + repo.name + '/pulls?state=all&per_page=30&page=' + page)
    return prResp.data.map(p => {
        const c = (p.comments > 0) ? p.comments : 0
        const r = (p.review_comments > 0) ? p.review_comments : 0

        return {
            id: p.id,
            number: p.number,
            url: p.html_url,
            title: p.title,
            user: p.user.login,
            body: p.body,
            createdAt: Date.parse(p.created_at),
            comments: c,
            reviews: r,
            commentsUrl: p.review_comments_url.split(process.env.GITHUB_URL)[1],
            reviewsUrl: p.review_comments_url.split(process.env.GITHUB_URL)[1].slice(0, -8) + "reviews",
        }
    })
}

async function getReviews(url) {
    const resp = await instance.get(url)
    return resp.data.filter(it => it.body.length > 0)
        .map(it => {
            let createdTime = null
            if (it.created_at === undefined) {
                createdTime = it.submitted_at
            } else {
                createdTime = it.created_at
            }

            return {
                id: it.id,
                userName: it.user.login,
                body: it.body,
                createdAt: Date.parse(createdTime),
                url: it.html_url
            }
        })
}

function buildResult(repo) {
    if (repo.prList === undefined) {
        return buildEmptyResult(repo)
    }

    const numOfPr = repo.prList.length
    const numOfNoComment = repo.prList.filter(pr => pr.reviews.length == 0)
        .map(pr => 1)
        .reduce((s1, s2) => s1 + s2, 0)

    return {
        name: repo.name,
        numOfPR: numOfPr,
        numOfNoCommentPR: numOfNoComment,
        repoUrl: `repository/${repo.name}`,
        reviewRate: (numOfPr == 0) ? 0 : parseFloat(((numOfPr - numOfNoComment) / numOfPr * 100).toFixed(1))
    }
}

function buildResultRange(repo, startDate, endDate) {
    if (repo.prList === undefined) {
        return buildEmptyResult(repo)
    }

    const numOfPr = repo.prList.length
    const numOfNoComment = repo.prList.filter(pr => pr.reviews.length == 0)
        .map(pr => 1)
        .reduce((s1, s2) => s1 + s2, 0)

    return {
        name: repo.name,
        numOfPR: numOfPr,
        numOfNoCommentPR: numOfNoComment,
        repoUrl: `repository/${repo.name}?startDate=${startDate}&endDate=${endDate}`,
        reviewRate: (numOfPr == 0) ? 0 : parseFloat(((numOfPr - numOfNoComment) / numOfPr * 100).toFixed(1))
    }
}

function buildEmptyResult(repo) {
    return {
        name: repo.name,
        numOfPR: 0,
        numOfNoCommentPR: 0,
        reviewRate: 0
    }
}