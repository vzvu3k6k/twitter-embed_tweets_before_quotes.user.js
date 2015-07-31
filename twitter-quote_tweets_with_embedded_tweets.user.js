// ==UserScript==
// @name           Twitter: Quote Tweets with Embedded Tweets
// @description    Inserts the embedded tweet when you click a quoted tweet snippet
// @version        1.0
// @author         vzvu3k6k
// @match          https://twitter.com/*
// @grant          none
// @noframes
// @namespace      http://vzvu3k6k.tk/
// @license        CC0
// ==/UserScript==

var handler = function(event) {
  var $quoteTweet = event.target, match;
  while ($quoteTweet && $quoteTweet.classList) {
    if ((match = $quoteTweet.classList.contains('QuoteTweet'))) break;
    $quoteTweet = $quoteTweet.parentNode;
  }
  if (!match) return;

  // Abort if embedded tweet has been already inserted
  var $prevSib = $quoteTweet.previousElementSibling;
  if ($prevSib.dataset.twttrId &&
      $prevSib.dataset.twttrId.indexOf('twttr-sandbox-') != -1) return;

  var insertTweet = function() {
    var tweetId = $quoteTweet.querySelector('.js-permalink').dataset.itemId;
    var $target = document.createElement('div');
    $quoteTweet.parentNode.insertBefore($target, $quoteTweet);
    twttr.widgets.createTweet(tweetId, $target);
  };

  if (!window.twttr) {
    // insertTweet is called when widgets.js is loaded
    window.twttr = {_e: [insertTweet]};

    var s = document.createElement('script');
    s.src = '//platform.twitter.com/widgets.js';
    document.head.appendChild(s);
  } else {
    insertTweet();
  }

  event.stopPropagation();
};

window.addEventListener('click', handler, true);
