const request = require('request');
const http = require('http');

const indexTweets=(req,res)=>{
  if(req.query.username){
    let count = req.query.count || 50
    let sinceDate = (req.query.fromDate ? '&sinceDate="'+req.query.fromDate+'"' : '')
    let toDate = (req.query.toDate ? '&toDate="'+req.query.toDate+'"' : '')

    search(req.query.username, count, sinceDate, toDate, function(response){
      if(Object.keys(response).length === 0 || req.query.more){
        max_id = (req.query.max_id ? '&max_id='+req.query.max_id : '');
        request(global.rootUrl+'/getTweets/'+req.query.username+'?count='+count+max_id, function(error, response, body){
          if(req.query.more){
            res.render('./twitter/tweet_list', {tweets: JSON.parse(body), url: req.originalUrl+ '&count=200', fromDate: (req.query.fromDate || ''), toDate: (req.query.toDate || '')} );
          }
          else{
            search(req.query.username, count, sinceDate, toDate,function(response){
              // if(req.query.fromDateRang){
              //   console.log(00)
              //   res.render('./twitter/tweet_data', {profileData: response.profileData, userSummary: response.userSummary, tweets: response.tweets, url: req.originalUrl+ '&count=200', fromDate: (req.query.fromDate || ''), toDate: (req.query.toDate || '')});
              // }else{
                res.render('./twitter/tweets', {profileData: response.profileData, userSummary: response.userSummary, tweets: response.tweets, url: req.originalUrl+ '&count=200', fromDate: (req.query.fromDate || ''), toDate: (req.query.toDate || '')});
              // }
            })
          }
        })
      }else{
        res.render('./twitter/tweets', {profileData: response.profileData, userSummary: response.userSummary, tweets: response.tweets, url: req.originalUrl+ '&count=200', fromDate: (req.query.fromDate || ''), toDate: (req.query.toDate || '')});
      }
    });
  }else{
    res.render('./twitter/index', {});
  }
}

function search(username, count, sinceDate, toDate, cb){
  request(global.rootUrl + '/getSummary/'+username+'?count='+count+sinceDate+toDate, function(error, response, body){
    if(error){
      cb(error)
    }else{
      cb(JSON.parse(body))
    }
    // return data = 
  })
}

module.exports={
  indexTweets:indexTweets
}