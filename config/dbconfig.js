const mongoose = require('mongoose')

const dbURI = 'mongodb://localhost/twitterDB'; 
const dbConnect = mongoose.connect(dbURI);

mongoose.connection.on('connected',function(){
    console.log('Connected to Mongodb ',dbURI);
})

module.exports=dbConnect