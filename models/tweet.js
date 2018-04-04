const mongoose = require('mongoose');

const tweets= new mongoose.Schema({
    tweetData:{type:Object}
},{versionKey:false})

module.exports=mongoose.model('tweet',tweets)