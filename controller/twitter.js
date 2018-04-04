const request = require('request');
const Twitter = require('twitter');
var dateFormat = require('dateformat');
const tweetSchema = require('../models/tweet')

const getTweets=(req,res)=>{
    const {twittername} = req.params
    const params = {
        screen_name: twittername
    };

    const optional_params = ['since_id','max_id','count']

    optional_params.forEach(option => {
        if(req.query[option]){
            params[option]=req.query[option]
        }
    });
    var client = new Twitter({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token_key: process.env.ACCESS_TOKEN_KEY,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
    });
    
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log(error);
            res.send(error)
        }else{
            tweets.forEach(tweet => {
                const tweetDate = new Date(tweet.created_at);
                tweet['tweetDate'] = tweetDate.getTime();
                tweetSchema
                .update({'tweetData.id': tweet.id},
                    {$set:{tweetData:tweet}},
                    {upsert:true,new:true})
                .exec((err,response)=>{
                    if(err){
                        console.error(err)
                        return
                    }
                })
                tweet.created_at = dateFormat(tweet.created_at, 'fullDate')
            });
            res.send(tweets)
        }        
    });
}

const getSummary=(req,res)=>{
    const {twittername} = req.params
    console.log(req.query.sinceDate, req.query.toDate)
    let query={};
    let count = 0;
    if(req.query.count){
        count=parseInt(req.query.count)
    }
    const optional_params = ['since_id','max_id']

    optional_params.forEach(option => {
        if(req.query[option]){
            query[option]=req.query[option]
        }
    });

    const matchQuery={}
    const dateArray=['sinceDate','toDate']

    dateArray.forEach(eachElement => {
        if(req.query[eachElement]){
            let date = new Date(req.query[eachElement]);
            // console.log(date)
            date = date.getTime();
            // console.log(date);
            // (option=='sinceDate')?query['$and'].push({'tweetData.tweetDate':{$gt:date}}):query['$and'].push({'tweetData.tweetDate':{$lt:date}})
            (eachElement=='sinceDate')?matchQuery['$gt']=date:matchQuery['$lt']=date+86400000
        }
    });
    
    (Object.keys(matchQuery).length>0)?query['tweetData.tweetDate']=matchQuery:null

    query['tweetData.user.screen_name']= new RegExp(twittername, "i")

    tweetSchema
    // .aggregate([
    //     {$match:query},
    //     { $group: { "_id": { : "$Code", name: "$Name" } } }
    // ])
    .find(query)
    .limit(count)
    .lean()
    .exec((err,response)=>{
        if(err){
            res.send(err)
        }else if(response.length>0){
            response.sort(function(a, b) {
                return parseFloat(b.tweetData.id) - parseFloat(a.tweetData.id);
            });
            const userSummary={
                statusCount:response[0].tweetData.user.statuses_count,
                lists:response[0].tweetData.user.listed_count,
                followers:response[0].tweetData.user.followers_count,
                favorites:response[0].tweetData.user.favourites_count
            }
            let reTweets_count=0;
            let tweetArray=[];
            response.forEach(each => {
                reTweets_count=reTweets_count+each.tweetData.retweet_count
                const tweetRec={
                    tweet_text:each.tweetData.text,
                    username:each.tweetData.user.name,
                    id:each.tweetData.id,
                    date:dateFormat(each.tweetData.created_at, 'fullDate')
                }
                tweetArray.push(tweetRec);
            });
            userSummary['reTweets_count']=reTweets_count

            const profileData = {
                name :response[0].tweetData.user.name,
                location : response[0].tweetData.user.location,
                description :response[0].tweetData.user.description,
                profile_image : response[0].tweetData.user.profile_image_url,
                createdAt : dateFormat(response[0].tweetData.user.created_at, 'fullDate')
            }

            const finalJson={
                userSummary:userSummary,
                tweets:tweetArray,
                profileData:profileData
            }

            res.send(finalJson);

        }else{
            res.send({})
        }   
    })
}

module.exports={
    getTweets:getTweets,
    getSummary:getSummary
}