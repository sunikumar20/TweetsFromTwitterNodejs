const express = require('express')
const router = express.Router()
const TwitterController = require('../controller/twitter')
const SearchController = require('../controller/search')

router.get('/', SearchController.indexTweets)
router.get('/search', SearchController.indexTweets)
router.get('/getTweets/:twittername', TwitterController.getTweets)
router.get('/getSummary/:twittername', TwitterController.getSummary)

module.exports=router