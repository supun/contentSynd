
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var Feed = require('feed');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/rss', function(req, res) {

    // Initializing feed object
    var feed = new Feed({
        title:          'My Feed Title',
        description:    'This is my personnal feed!',
        link:           'http://example.com/',
        image:          'http://example.com/logo.png',
        copyright:      'Copyright © 2013 John Doe. All rights reserved',

        author: {
            name:       'John Doe',
            email:      'john.doe@example.com',
            link:       'https://example.com/john-doe'
        }
    });

    // Function requesting the last 5 posts to a database. This is just an
    // example, use the way you prefer to get your posts.
   /* Post.findPosts(function(posts, err) {
        if(err)
            res.send('404 Not found', 404);
        else {
            for(var key in posts) {
                feed.item({
                    title:          posts[key].title,
                    link:           posts[key].url,
                    description:    posts[key].description,
                    date:           posts[key].date
                });
            }
            // Setting the appropriate Content-Type
            res.set('Content-Type', 'text/xml');

            // Sending the feed as a response
            res.send(feed.render('rss-2.0'));
        }
    });*/
    res.set('Content-Type', 'text/xml');
    res.send(feed.render('rss-2.0'));
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
