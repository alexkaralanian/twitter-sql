'use strict';

// TODO: Query database

const express = require('express');
const router = express.Router();
const tweetBank = require('../tweetBank'); // TODO delete

module.exports = io => {

  // a reusable function
  const respondWithAllTweets = (req, res, next) => {
    const allTheTweets = tweetBank.list();
    res.render('index', {
      title: 'Twitter.js',
      tweets: allTheTweets,
      showForm: true
    });
  }

  // root view and tweets view are identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:username', (req, res, next) => {
    const tweetsForName = tweetBank.find({ name: req.params.username });
    res.render('index', {
      title: 'Twitter.js',
      tweets: tweetsForName,
      showForm: true,
      username: req.params.username
    });
  });

  // single-tweet page
  router.get('/tweets/:id', (req, res, next) => {
    const tweetsWithThatId = tweetBank.find({ id: Number(req.params.id) });
    res.render('index', {
      title: 'Twitter.js',
      tweets: tweetsWithThatId // an array of only one element ;-)
    });
  });

  // create a new tweet
  router.post('/tweets', (req, res, next) => {
    const newTweet = tweetBank.add(req.body.name, req.body.text);
    io.sockets.emit('new_tweet', newTweet);
    res.redirect('/');
  });

  return router;
}
