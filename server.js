const express=require('express')
const app = express()
const routes = require('./routes/base')
const dbconfig = require('./config/dbconfig')
// const request = require('ajax-request');
require('dotenv').config()

app.use('/',routes)
app.set('view engine', 'jade')
app.set('views', __dirname + '/views')
app.set(express.static(__dirname + '/public'))

app.use(express.static(__dirname + '/public'))

var server = app.listen(7500, 'localhost',function(re){
    var host = server.address().address  
    var port = server.address().port  
    global.rootUrl = 'http://'+host+':'+port
    console.log("App listening at http://%s:%s", host, port) 
})