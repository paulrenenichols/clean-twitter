const Twitter = require('twitter');

const config = require('./config/config');

// console.log('config ', JSON.stringify(config, null, 2));

const client = new Twitter(config);

const favoritesData = require('../twitter-data/like');

// console.log('favoritesData ', JSON.stringify(favoritesData, null, 2));

function wait(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

function getFavorites(count) {
  return new Promise((resolve, reject) => {
    client.get('favorites/list', {count}, function(error, tweets, response) {
      console.log(`getFavorites count ${count} tweets: ${JSON.stringify(tweets, null, 2)}`);
      console.log(`getFavorites count ${count} response: ${JSON.stringify(response, null, 2)}`);
      if(error) {
        console.log(`getFavorites error: ${JSON.stringify(error, null, 2)}`);
        return reject(error);
      };

      return resolve(tweets);
    });
  });
}

function favoriteTweet(id) {
  return new Promise((resolve, reject) => {
    client.post('favorites/create', {id}, function(error, tweet, response) {
      console.log(`tweet favorite create id ${id} tweet: ${JSON.stringify(tweet, null, 2)}`);
      console.log(`tweet favorite create id ${id} response: ${JSON.stringify(response, null, 2)}`);
      if(error) {
        console.log(`tweet favorite create error id ${id} error: ${JSON.stringify(error, null, 2)}`);
        return reject(error);
      };

      return resolve(id);
    });
  });
}

function unFavoriteTweet(id) {
  return new Promise((resolve, reject) => {
    client.post('favorites/destroy', {id}, function(error, tweet, response) {
      console.log(`tweet favorite destroy id ${id} tweet: ${JSON.stringify(tweet, null, 2)}`);
      console.log(`tweet favorite destroy id ${id} response: ${JSON.stringify(response, null, 2)}`);
      if(error) {
        console.log(`tweet favorite destroy error id ${id} error: ${JSON.stringify(error, null, 2)}`);
        return reject(error);
      };
      return resolve(id);
    });
  });
}

async function throttleFavoriteUnFavoriteTweet(id, delay) {

  try {
    await favoriteTweet(id);
  }
  catch (error) {
  }

  await wait(delay);

  try {
    await unFavoriteTweet(id);
  }
  catch (error) {
  }

  await wait(delay);
}

async function throttleUnFavoriteTweet(id, delay) {


  try {
    await unFavoriteTweet(id);
  }
  catch (error) {
  }

  await wait(delay);
}

async function processFavoriteUnfavoriteTweets(favoritesData, delay) {
  for (const tweet of favoritesData) {
    console.log('processing tweet id, start ', tweet.like.tweetId);
    await throttleFavoriteUnFavoriteTweet(tweet.like.tweetId, delay);
    console.log('processing tweet id, complete ', tweet.like.tweetId);
  }
}

async function processUnfavoriteTweets(favoritesData, delay) {
  for (const tweet of favoritesData) {
    console.log('processing unfavorite tweet id, start ', tweet.like.tweetId);
    await throttleUnFavoriteTweet(tweet.like.tweetId, delay);
    console.log('processing unfavorite tweet id, complete ', tweet.like.tweetId);
  }
}



// throttleUnFavoriteTweet('583328954968371200', 60 * 1000);

// processUnfavoriteTweets(favoritesData, 60 * 1000);

// getFavorites(10);

client.get('favorites/list', { count: 10, user_id: 283941500 }, function(error, tweets, response) {
  if(error) {

  }
  console.log(tweets);  // The favorites.
  // console.log(response);  // Raw response object.
});
