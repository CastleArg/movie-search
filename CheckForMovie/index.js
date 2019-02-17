const sgMail = require('@sendgrid/mail');
const axios = require('axios');

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    var movieTitle = process.env.MOVIE_TITLE;
    context.log('JavaScript timer trigger function ran!', timeStamp);

    await axios.get(`https://yts.am/api/v2/list_movies.json?query_term=${movieTitle}`)
        .then(response => {
            context.log('movie count:', response.data.data.movie_count);
            if (response.data.data.movie_count > 0) {
                const msg = {
                    to: process.env.USER_EMAIL,
                    from: 'no-reply@popcornfunc.com',
                    subject: `${movieTitle} is out`,
                    text: `${movieTitle} is out`,
                    html: `<strong>${movieTitle} is out</strong>`,
                };
                sgMail.send(msg);
            }
            else {
                context.log(`${movieTitle} is not out`);
            }
        })
        .catch(e => {
            context.log(e);
            const msg = {
                to: process.env.USER_EMAIL,
                from: 'no-reply@popcornfunc.com',
                subject: `error in movie search`,
                text: `error in movie search`,
                html: `<p>${e}</>`,
            };
            sgMail.send(msg);
        });
};