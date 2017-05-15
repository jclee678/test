var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');


const Web3 = require("web3");
const web3 = new Web3();

// [start rpc server on geth console] admin.startRPC(0.0.0.0, 8545)
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8008"));

console.log(web3.eth.coinbase);
console.log('Connected to Ethereum');

var centralBankId = '0xE3385e66ff2D11195F7af9c631e99A44fdBc5Bed';

var contractAbi = [ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string", "value": "KC" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "vendorId", "type": "string" }, { "name": "consumerId", "type": "string" }, { "name": "value", "type": "uint256" }, { "name": "comment", "type": "string" } ], "name": "redeemPointByConsumer", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256", "value": "99999999" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "id", "type": "string" }, { "name": "index", "type": "uint256" } ], "name": "getOneConsumerSpentRewardMessage", "outputs": [ { "name": "", "type": "string" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "index", "type": "int256" } ], "name": "getConsumer", "outputs": [ { "name": "", "type": "string", "value": "jclee" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "loginId", "type": "string" } ], "name": "alreadyMemberComnsumer", "outputs": [ { "name": "memberAlready", "type": "int256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "vendorId", "type": "string" } ], "name": "addVendorIfAbsent", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "memberAddr", "type": "string" } ], "name": "addVendor", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getConsumerCount", "outputs": [ { "name": "", "type": "int256", "value": "2" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "consumerId", "type": "string" } ], "name": "getNumberOfRewardsEarnedByConsumer", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "id", "type": "string" }, { "name": "index", "type": "uint256" } ], "name": "getOneSpentRewardOnVendorMessage", "outputs": [ { "name": "", "type": "string" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "consumerId", "type": "string" }, { "name": "point", "type": "uint256" } ], "name": "saveConsumerPoint", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "vendorId", "type": "string" } ], "name": "getNumberOfRewardsSpentOnVendor", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "uid", "type": "string" } ], "name": "getPointReceivedByVendor", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "id", "type": "string" }, { "name": "index", "type": "uint256" } ], "name": "getOneGivenRewardMessage", "outputs": [ { "name": "", "type": "string" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "vendorId", "type": "string" }, { "name": "pointToGive", "type": "uint256" }, { "name": "pointReceived", "type": "uint256" } ], "name": "saveVendorPoints", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "vendorId", "type": "string" } ], "name": "getNumberOfRewardsGivenByVendor", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0xe3385e66ff2d11195f7af9c631e99a44fdbc5bed" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "uid", "type": "string" } ], "name": "getConsumerBalance", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "x", "type": "bytes32" } ], "name": "bytes32ToString", "outputs": [ { "name": "", "type": "string", "value": "" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string", "value": "KC" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "vendorId", "type": "string" }, { "name": "consumerId", "type": "string" }, { "name": "value", "type": "uint256" }, { "name": "comment", "type": "string" } ], "name": "givePointByVendor", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_value", "type": "uint256" } ], "name": "distributePoint", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "memberAddr", "type": "string" } ], "name": "addConsumer", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "source", "type": "string" } ], "name": "stringToBytes32", "outputs": [ { "name": "result", "type": "bytes32" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "uid", "type": "string" } ], "name": "getPointToGiveByVendor", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "vendorId", "type": "string" }, { "name": "consumerId", "type": "string" }, { "name": "_value", "type": "uint256" } ], "name": "redeemPoint", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "string" }, { "name": "_value", "type": "uint256" } ], "name": "sendPointToVendors", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "consumerId", "type": "string" } ], "name": "getNumberOfRewardsSpentByConsumer", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "index", "type": "int256" } ], "name": "getVendor", "outputs": [ { "name": "", "type": "string", "value": "amazon" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "id", "type": "string" }, { "name": "index", "type": "uint256" } ], "name": "getOneEarnedRewardMessage", "outputs": [ { "name": "", "type": "string" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "inputs": [ { "name": "initialSupply", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "initial Supply", "template": "elements_input_uint", "value": "99999999" }, { "name": "tokenName", "type": "string", "index": 1, "typeShort": "string", "bits": "", "displayName": "token Name", "template": "elements_input_string", "value": "KC" }, { "name": "tokenSymbol", "type": "string", "index": 2, "typeShort": "string", "bits": "", "displayName": "token Symbol", "template": "elements_input_string", "value": "KC" } ], "payable": false, "type": "constructor" }, { "payable": false, "type": "fallback" } ];

var contractAddress = '0x20C071263F53b10f292AAbB1a42A0959138a098A';   
var perfContract = web3.eth.contract(contractAbi);
var perfCInstance = perfContract.at(contractAddress);


var oldContractAbi = contractAbi;

var oldContractAddress = '0xcf521b9a379F8F079fbD90B30097e7d3421BE393';
var oldContract = web3.eth.contract(oldContractAbi);
var oldCInstance = oldContract.at(oldContractAddress);



var event = perfCInstance.allEvents()
  console.log("listening for events on ", contractAddress)
  // watch for changes
  event.watch(function(error, result){ //This is where events can trigger changes in UI
    if (!error)
      console.log(result);
  });

// Connect to Neo4J
/*
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo4j"));
var session = driver.session();
console.log('Connected to Neo4J');
session.run( "match(m) return m").then( function(result)
{
    console.log(result.records.length);   
});
*/


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.listen(3000);



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.get('/dist/:amt', function (req, res) {

  var result = perfCInstance.distributePoint.sendTransaction(req.params.amt, {from: centralBankId, gas: 500000});
  console.log("allowance dist res = " + result + ", amt = " + req.params.amt);
  res.send('0')
})


app.get('/sendPointToVendor/:vendorId/:amt', function (req, res) {

  var result = perfCInstance.sendPointToVendors.sendTransaction(req.params.vendorId, req.params.amt, {from: centralBankId, gas: 500000});
  res.send('0')
})

app.get('/addVendor/:vendorId', function (req, res) {

  var result = perfCInstance.addVendor.sendTransaction(req.params.vendorId, {from: centralBankId, gas: 500000});
  res.send('0')
})

app.get('/addConsumer/:consumerId', function (req, res) {

  var result = perfCInstance.addConsumer.sendTransaction(req.params.consumerId, {from: centralBankId, gas: 500000});
  res.send('0')
})


app.get('/getNumberOfConsumers', function (req, res) {
    var count = perfCInstance.getConsumerCount();
    res.send(count);
})

//   ----------------------------------------------------------------------

app.get('/getPointToGiveByVendor/:vendorId', function (req, res) {
    var amt = perfCInstance.getPointToGiveByVendor(req.params.vendorId);
    res.send(amt);
})

app.get('/getPointReceivedByVendor/:vendorId', function (req, res) {
    var amt = perfCInstance.getPointReceivedByVendor(req.params.vendorId);
    res.send(amt);
})

app.get('/getConsumerBalance/:userId', function (req, res) {
    var amt = perfCInstance.getConsumerBalance(req.params.userId);
    res.send(amt);
})


app.get('/redeemPointByConsumer/:vendor/:consumerId/:value/:comment', function (req, res) {

  var result = perfCInstance.redeemPointByConsumer.sendTransaction(req.params.vendorId, req.params.consumerId, req.params.value, req.params.comment, {from: centralBankId, gas: 500000});
  res.send('0')
})

app.get('/getNumberOfRewardsSpentByConsumer/:consumerId', function (req, res) {
    var count = perfCInstance.getNumberOfRewardsSpentByConsumer(req.params.consumerId);
    res.send(count);
})


app.get('/getOneConsumerSpentRewardMessage/:consumerId/:index', function (req, res) {
    var result = perfCInstance.getOneConsumerSpentRewardMessage(req.params.consumerId, req.params.index);
    res.send(result);
})


app.get('/getNumberOfRewardsSpentOnVendor/:vendorId', function (req, res) {
    var count = perfCInstance.getNumberOfRewardsSpentOnVendor(req.params.vendorId);
    res.send(count);
})


app.get('/getOneSpentRewardOnVendorMessage/:vendorId/:index', function (req, res) {
    var result = perfCInstance.getOneConsumerSpentRewardMessage(req.params.vendorId, req.params.index);
    res.send(result);
})


app.get('/givePointByVendor/:vendor/:consumerId/:value/:comment', function (req, res) {

  var result = perfCInstance.givePointByVendor.sendTransaction(req.params.vendorId, req.params.consumerId, req.params.value, req.params.comment, {from: centralBankId, gas: 500000});
  res.send('0')
})

app.get('/getNumberOfRewardsEarnedByConsumer/:consumerId', function (req, res) {
    var count = perfCInstance.getNumberOfRewardsEarnedByConsumer(req.params.consumerId);
    res.send(count);
})

app.get('/getOneEarnedRewardMessage/:consumerId/:index', function (req, res) {
    var result = perfCInstance.getOneEarnedRewardMessage(req.params.consumerId, req.params.index);
    res.send(result);
})

app.get('/getNumberOfRewardsGivenByVendor/:vendorId', function (req, res) {
    var count = perfCInstance.getNumberOfRewardsGivenByVendor(req.params.vendorId);
    res.send(count);
})

app.get('/getOneGivenRewardMessage/:vendorId/:index', function (req, res) {
    var result = perfCInstance.getOneGivenRewardMessage(req.params.vendorId, req.params.index);
    res.send(result);
})




app.get('/isConsumerMemberAlready/:userId', function (req, res) {
    var ans = perfCInstance.alreadyMemberComnsumer(req.params.userId);
    res.send(ans);
})












app.get('/migrate', function (req, res) {
    
    var numUsers = oldCInstance.getMemberCount();
    console.log("Number of users to be migrated: " + numUsers);
    for (var i = 0; i < numUsers; i++) {
        var memberId = oldCInstance.getMember(i);
        console.log("index: " + i + " , mem id: " + memberId);
        perfCInstance.addMember.sendTransaction(memberId, {from: centralBankId , gas: 1000000});
        
        var balance = oldCInstance.getBalance(memberId);
        var allowance = oldCInstance.getAllowance(memberId);       
        perfCInstance.saveBalanceAndAllowance.sendTransaction(memberId, balance, allowance, {from: centralBankId , gas: 1000000});
        
        var numMesgs = oldCInstance.getNumberOfMessages(memberId);
        console.log("Messages to be migrated: " + numMesgs);
        if (numMesgs > 0) {  
            for (var j = 0; j < numMesgs; j++) {
                var result = oldCInstance.getOneReceivedKudoMessage(memberId, j); 
                console.log(result);
                // kd.sender, kd.group, kd.behavior, kd.message, kd.amount, kd.time
                //string fromId, string toId, string group, string behavior, uint256 value, string message, uint savedTime, uint migrate
                perfCInstance.sendComplimentFromById.sendTransaction(result[0], memberId, result[1], result[2], result[3], result[4], result[5], 1, {from: centralBankId , gas: 1000000});
      
            }
        }
    }
    
    res.send('0');
})



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
