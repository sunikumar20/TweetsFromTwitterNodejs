// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
const connect = MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
  if(!err) {
    console.log("We are connected");
    var db = db.db("twitterDB");
    return db
  }
});

module.exports={
    connect:connect
}