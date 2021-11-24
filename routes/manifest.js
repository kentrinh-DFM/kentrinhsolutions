var express = require('express');
var sessions = require('express-session');
const cookieParser = require("cookie-parser");

var router = express.Router();

// const csvController = require('../controllers/generateCsv')

const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
// const records = require('../data');
const ResponseService = require('../services/responseService');
const AWS = require("aws-sdk");
const https = require('https')
const request = require('request')
const _ = require("lodash");


const dotenv = require('dotenv');
dotenv.config();

// for google sheets
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

//Parse json to CSV
const { parse } = require('json2csv');
// const opts = {Driver}

// creating 24 hours from milliseconds


const oneDay = 1000 * 60 * 60 * 24;
const fiveminute = 1000 * 5;


// FOR LOGIN SESSION 
//username and password
const myusername = 'admin'
const mypassword = 'Compass@123'

// a variable to save a session
var session;

// parsing the incoming data
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//session middleware
router.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: fiveminute },
    resave: false
}));

// cookie parser middleware
router.use(cookieParser());

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// console.log(`Your port is ${process.env.AWS_BUCKET}`); // 8626
var api_token = "apikey=OlZ7r3OK-iahNBZkMAzv2C3HVa2Qs4BfOqMXK48V5Lq_&grant_type=urn%3Aibm%3Aparams%3Aoauth%3Agrant-type%3Aapikey"

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
});


/* GET all files listing. */
var search = "IVMSIncentive"
router.get('/', function(req, res, next) {
    const params = {
        Bucket: process.env.AWS_BUCKET // pass your bucket name
    };

    s3.listObjects(params).promise().then(function(data) {
            // do something with data here
            var items = data.Contents
            var IVMSItems = _.filter(items, function(item) {
                item.Key = _.split(item.Key, "/", 3)
                // console.log(item.Key)
                return item.Key.indexOf(search) > -1
            });

            res.send(IVMSItems)

        })
        .catch(function(error) {
            // handle your error here
        });

});


// POST method route
router.post('/', function(req, res) {
    if (login) {
        var token = req.body
        // console.log(token.data)
        name = token.filename.split(".")[0].replace(/\s/g, '')
        key = search + name + "/" + name + '.csv'

        try {

            // const csv = csvStringifier.stringifyRecords(token.data);
            // console.log(csv)

            const csv = parse(token.data);

            const params = {
                Bucket: process.env.AWS_BUCKET, // pass your bucket name
                Key: key, // file will be saved as testBucket/contacts.csv
                ACL: "public-read",
                Body: csv,
                ContentType: "text/csv",
            };

            s3.upload(params, function(s3Err, data) {
                if (s3Err) throw s3Err;
                console.log("Successfully uploaded data to myBucket/myKey");
                res.send(200)
            })


        } catch (e) {
            res.send(e)
        }
    }


})



var login = false;
router.post('/user', (req, res) => {
    console.log(res.body)
    if (req.body.username == myusername && req.body.password == mypassword) {
        session = req.session;
        session.userid = req.body.username;
        login = true;
        res.send(login);
    } else {
        res.send('Invalid username or password');
    }
})

router.get('/user', (req, res) => {
    res.send(login)

})


router.get('/logout', (req, res) => {
    login = false;
    res.send("logout")
});


// get method route
router.post('/removefile', function(req, res) {
    // console.log(req.body)
    keyarr = req.body.Key
    key = keyarr[0] + "\\" + keyarr[1] + "\\" + keyarr[2]
    console.log(key)
    const params = {
        Bucket: process.env.AWS_BUCKET, // pass your bucket name
        Key: key // file will be saved as testBucket/contacts.csv
    };

    s3.deleteObject(params, function(err, data) {
        if (err) console.log(err);
        else res.send(data.Body.toString()); // successful response
    });

})

module.exports = router;