// ==UserScript==
// @name           Twitter: Quote Tweets with Embedded Tweets
// @description    Inserts the oembed content when you click a quoted tweet snippet
// @version        1.0
// @author         vzvu3k6k
// @match          https://twitter.com/*
// @grant          GM_log
// @grant          GM_xmlhttpRequest
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
  if ($quoteTweet.classList.contains('__expanded')) return;

  var url = $quoteTweet.querySelector('.js-permalink').getAttribute('href');
  GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://api.twitter.com/1/statuses/oembed.json?url=' + encodeURIComponent('https://twitter.com' + url),
    onload: (response) => {
      var oembed = JSON.parse(response.responseText);
      $quoteTweet.innerHTML = oembed.html;
      $quoteTweet.classList.add('__expanded');

      if (document.querySelector('head > script[src="//platform.twitter.com/widgets.js"]')) {
        location.href = 'javascript:twttr.widgets.load()';
      } else {
        var s = document.createElement('script');
        s.src = '//platform.twitter.com/widgets.js';
        document.head.appendChild(s);
      }
    },
  });

  event.stopPropagation();
};

window.addEventListener('click', handler, true);
