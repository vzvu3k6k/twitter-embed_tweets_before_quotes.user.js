// ==UserScript==
// @name           Twitter: Embed Tweets before Quotes
// @description    Inserts the embedded tweet when you click a quoted tweet snippet
// @version        1.1
// @author         vzvu3k6k
// @match          https://twitter.com/*
// @grant          none
// @noframes
// @namespace      http://vzvu3k6k.tk/
// @license        CC0
// ==/UserScript==

/* js-standard-style (https://github.com/feross/standard) */

var handler = function (event) {
  if (event.button !== 0) return

  var $quoteTweet = event.target
  var match
  while ($quoteTweet && $quoteTweet.classList) {
    if ((match = $quoteTweet.classList.contains('QuoteTweet'))) break
    $quoteTweet = $quoteTweet.parentNode
  }
  if (!match) return

  // An embedded tweet is blanked after expanding a tweet container
  // or pjax page transition.
  // So, we remove blanked embedded tweets here.
  Array.from($quoteTweet.parentNode.querySelectorAll('.twitter-tweet-rendered'))
    .filter((node) => node.contentDocument.body.childElementCount === 0)
    .forEach((node) => node.parentNode.remove())

  var tweetId = $quoteTweet.querySelector('.js-permalink').dataset.itemId

  // Abort if embedded tweet has been already inserted
  try {
    var $prevSib = $quoteTweet.previousElementSibling
    var $prevSibChild = $prevSib.firstElementChild
    if ($prevSibChild.dataset.tweetId === tweetId) return
  } catch (e) {}

  var insertTweet = function () {
    var $target = document.createElement('div')
    $quoteTweet.parentNode.insertBefore($target, $quoteTweet)
    window.twttr.widgets.createTweet(tweetId, $target)
  }

  if (!window.twttr) {
    // insertTweet is called when widgets.js is loaded
    window.twttr = {_e: [insertTweet]}

    var s = document.createElement('script')
    s.src = '//platform.twitter.com/widgets.js'
    document.head.appendChild(s)
  } else {
    insertTweet()
  }

  event.stopPropagation()
  event.preventDefault()
}

window.addEventListener('click', handler, true)
