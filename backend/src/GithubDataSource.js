require('dotenv').config();

const axios = require('axios');
const instance = axios.create({
    baseURL: process.env.GITHUB_URL,
    timeout: 100000,
    headers: { 'Authorization': 'Basic ' + Buffer.from(`${process.env.GITHUB_KEY}`).toString('base64') }
});

exports.getPullRequests = async function (repo, page) {
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

exports.getReviews = async function (url) {
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
