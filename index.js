import cheerio from 'cheerio';
import request from 'request';
import _ from 'lodash';
import a from 'async';

import queries from './queries';

const MAX_AJAX_COUNT = 6;
const CSV_SETTINGS = {
    separator: '||||',
    newline: '\n',
    headers: ['title', 'duration', ' uploader', 'uploaded', 'views', 'url'],
    sendHeaders: true
};

function start() {
    a.eachLimit(queries,
        MAX_AJAX_COUNT,
        searchQuery,
        function(err) {
            if(err) {
                return console.log('Finished scraping with errors');
            }

            return console.log('Finished successfully');
        }
    );
}

function searchQuery(query, done) {
    const options = {
        baseUrl: 'https://www.youtube.com',
        url: '/results',
        qs: {
            q: query
        }
    };


    request(options, handleSearchPage.bind(this, done));
}

function handleSearchPage(done, err, res, body) {
    // done() should be in closure if this is invoked from searchQuery()
    // use bind otherwise
    if(err) {
        return done(err);
    }

    const $ = cheerio.load(body);
    const videoList = $('ol.item-section')
            .children() // <li> elements
            .map((index, element) => {
                const title = $(element).find('h3.yt-lockup-title')
                    .find('a')
                    .attr('title');
                const duration = $(element).find('span.video-time')
                    .text();
                const uploader = $(element).find('.yt-lockup-byline')
                    .find('a')
                    .text();
                const uploaded = $(element).find('.yt-lockup-meta-info')
                    .children()
                    .first()
                    .text();
                const views = $(element).find('.yt-lockup-meta-info')
                    .children()
                    .last()
                    .text()
                    .match(/(,?[0-9]+)+/g);
                const url = $(element).find('h3.yt-lockup-title')
                    .find('a')
                    .attr('href');

                return {
                    title,
                    duration,
                    uploader,
                    uploaded,
                    views,
                    url,
                };
            })
            .get();

    console.log(videoList);
    done();
}


start();
