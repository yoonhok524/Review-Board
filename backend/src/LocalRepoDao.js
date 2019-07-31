const logger = require('../common/logger')
const reviewDataSource = require('./ReviewDataSource');

exports.get = async function (repository) {
    const result = {
        prs: []
    }

    const prList = await reviewDataSource.getPRs(repository)
    for (const p of prList) {
        p.reviewList = await reviewDataSource.getReviewsFromDb(p.id)
        result.prs.push(buildResult(p))
    }

    return result
}

exports.getRange = async function (repository, startDate, endDate) {
    logger.info(`[GET] getRange - ${startDate} ~ ${endDate}`)
    const result = {
        startDate: startDate,
        endDate: endDate,
        prs: []
    }

    const sDate = Date.parse(startDate)
    const eDate = Date.parse(endDate)

    const prList = await reviewDataSource.getPRsRange(repository, sDate, eDate)
    for (const p of prList) {
        p.reviewList = await reviewDataSource.getReviewsFromDb(p.id)
        result.prs.push(buildResult(p))
    }

    return result
}

exports.like = async function (repoName, prId) {
    const pr = (await reviewDataSource.getPR(prId))[0];
    let count = parseInt(pr.countOfGood)
    await reviewDataSource.increaseLikeCount(prId, ++count);
    pr.countOfGood = count;
    return pr
}

function buildResult(pr) {
    let numOfReviews = 0
    if (pr.reviewList === undefined) {
        numOfReviews = 0
    } else {
        numOfReviews = pr.reviewList.length
    }

    const d = new Date(pr.createdAt)
    const date = `${("0" + d.getFullYear()).slice(-2)}. ${("0" + (d.getMonth()+1)).slice(-2)}. ${("0" + d.getDate()).slice(-2)}.`;
    const time = `${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}`;

    return {
        id: pr.id,
        date: `${date} ${time}`,
        title: pr.title,
        url: pr.url,
        numOfReviews: numOfReviews,
        countOfGood: pr.countOfGood * 1,
    }
}