var express = require('express');
var router = express.Router();

// const csvController = require('../controllers/generateCsv')

const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
// const records = require('../data');
//const ResponseService = require('../services/responseService');
const AWS = require("aws-sdk");
const https = require('https')
const request = require('request')

const dotenv = require('dotenv');
dotenv.config();
// console.log(`Your port is ${process.env.AWS_BUCKET}`); // 8626
var api_token = "apikey=OlZ7r3OK-iahNBZkMAzv2C3HVa2Qs4BfOqMXK48V5Lq_&grant_type=urn%3Aibm%3Aparams%3Aoauth%3Agrant-type%3Aapikey"

project_id = "987379fc-57f2-4ca2-93fe-be592e95d826"
job_id = "1d521767-d208-4c56-aea8-990d90b85689"
s_url = 'https://api.dataplatform.cloud.ibm.com/v2/jobs/' + job_id + '/runs?project_id=' + project_id
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
});


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('somethinghere');
});


// POST method route
router.post('/', function(req, res) {
    var token = req.body.Token
    console.log(token)
    try {
        if (token === "DeltaIoT@$$et") {
            const fs = require('fs');
            const readline = require('readline');
            const { google } = require('googleapis');

            // If modifying these scopes, delete token.json.
            const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
            // The file token.json stores the user's access and refresh tokens, and is
            // created automatically when the authorization flow completes for the first
            // time.
            const TOKEN_PATH = 'token.json';

            // Load client secrets from a local file.
            fs.readFile('credentials.json', (err, content) => {
                if (err) return console.log('Error loading client secret file:', err);
                // Authorize a client with credentials, then call the Google Sheets API.
                authorize(JSON.parse(content), listMajors)

            })




            /**
             * Create an OAuth2 client with the given credentials, and then execute the
             * given callback function.
             * @param {Object} credentials The authorization client credentials.
             * @param {function} callback The callback to call with the authorized client.
             */
            function authorize(credentials, callback) {
                const { client_secret, client_id, redirect_uris } = credentials.installed;
                const oAuth2Client = new google.auth.OAuth2(
                    client_id, client_secret, redirect_uris[0]);

                // Check if we have previously stored a token.
                fs.readFile(TOKEN_PATH, (err, token) => {
                    if (err) return getNewToken(oAuth2Client, callback);
                    oAuth2Client.setCredentials(JSON.parse(token));
                    callback(oAuth2Client);
                });
            }

            /**
             * Get and store new token after prompting for user authorization, and then
             * execute the given callback with the authorized OAuth2 client.
             * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
             * @param {getEventsCallback} callback The callback for the authorized client.
             */
            function getNewToken(oAuth2Client, callback) {
                const authUrl = oAuth2Client.generateAuthUrl({
                    access_type: 'offline',
                    scope: SCOPES,
                });
                console.log('Authorize this app by visiting this url:', authUrl);
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                rl.question('Enter the code from that page here: ', (code) => {
                    rl.close();
                    oAuth2Client.getToken(code, (err, token) => {
                        if (err) return console.error('Error while trying to retrieve access token', err);
                        oAuth2Client.setCredentials(token);
                        // Store the token to disk for later program executions
                        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                            if (err) return console.error(err);
                            console.log('Token stored to', TOKEN_PATH);
                        });
                        callback(oAuth2Client);
                    });
                });
            }

            /**
             * Prints the names and majors of students in a sample spreadsheet:
             * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
             * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
             */
            function listMajors(auth) {
                const sheets = google.sheets({ version: 'v4', auth });
                sheets.spreadsheets.values.get({
                    spreadsheetId: '1pSL2d0SvSBuYpui5NIsTukdunt-15gKYvgZZzEjhqgc',
                    range: 'Sheet1!A:E',
                }, (err, res) => {
                    if (err) return console.log('The API returned an error: ' + err);
                    const rows = res.data.values;
                    if (rows.length) {


                        // console.log(rows[0])
                        records = arrToObject(rows)

                        const csvStringifier = createCsvStringifier({
                            header: [{ id: 'Asset Barcode', title: 'Asset Barcode' },
                                { id: 'From Date', title: 'From Date' },
                                { id: 'To Date', title: 'To Date' },
                                { id: 'Scenario', title: 'Scenario' }
                            ]
                        });

                        const csv = csvStringifier.stringifyRecords(records);
                        console.log(csv)
                        const params = {
                            Bucket: process.env.AWS_BUCKET, // pass your bucket name
                            Key: `FM/IoT/AssetMonitoringList/AssetMonitoringList.csv`, // file will be saved as testBucket/contacts.csv
                            ACL: "public-read",
                            Body: csv,
                            ContentType: "text/csv",
                        };

                        s3.upload(params, function(s3Err, data) {
                            if (s3Err) throw s3Err;


                            console.log("Successfully uploaded data to myBucket/myKey");

                            return new Promise(resolve => {
                                setTimeout(() => postIBMJobs(), 20000)
                            })


                        })

                        // setTimeout(function() {;

                        // }, 5000)

                        // console.log('Name, Major:');
                        // Print columns A and E, which correspond to indices 0 and 4.
                        // rows.map((row) => {
                        //     console.log(`${row[0]}, ${row[4]}`);
                        // });


                    } else {
                        console.log('No data found.');
                    }


                });
            }

            function postIBMJobs() {
                request.post({
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    url: 'https://iam.ng.bluemix.net/identity/token',
                    body: api_token
                }, function(error, response, body) {
                    token = JSON.parse(body)
                    // console.log(token.access_token);
                    var Authorization = "Bearer " + token.access_token

                    j_data = JSON.stringify({
                        "job_run": {
                            "configuration": {

                            }
                        }
                    })

                    request.post({
                        headers: { "Content-Type": "application/json", "Authorization": Authorization },
                        url: s_url,
                        body: j_data
                    }, function(error, response, body) {

                        // res.send('A job is run')
                        // console.log(body)
                        message = JSON.parse(body)
                        console.log(message.metadata)
                        res.send(200, res, message)
                        return response

                    });

                });
            }
            //create JSON object from 2 dimensional Array
            function arrToObject(arr) {
                //assuming header
                var keys = arr[0];
                //vacate keys from main array
                var newArr = arr.slice(1, arr.length);

                var formatted = [],
                    data = newArr,
                    cols = keys,
                    l = cols.length;
                for (var i = 0; i < data.length; i++) {
                    var d = data[i],
                        o = {};
                    for (var j = 0; j < l; j++)
                        o[cols[j]] = d[j];
                    formatted.push(o);
                }
                return formatted;
            }
        }



    } catch (e) {
        return e
    }

})

// get method route
router.get('/date', function(req, res) {

    const params = {
        Bucket: process.env.AWS_BUCKET, // pass your bucket name
        Key: `chosen_time.csv` // file will be saved as testBucket/contacts.csv
    };

    s3.getObject(params, function(err, data) {
        if (err) console.log(err);
        else res.send(data.Body.toString()); // successful response
    });

})

// get method route
router.get('/lastjob', function(req, res) {
    request.post({
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: 'https://iam.ng.bluemix.net/identity/token',
        body: api_token
    }, function(error, response, body) {
        token = JSON.parse(body)
        // console.log(token.access_token);
        var Authorization = "Bearer " + token.access_token

        request.get({
            headers: { "Content-Type": "application/json", "Authorization": Authorization },
            url: s_url
        }, function(error, response, body) {

            // console.log(body)
            // res.send('A job is run')
            message = JSON.parse(body)
            console.log(typeof message)
            if (typeof message !== 'undefined') {
                lastjob = message['results'][0].entity
                res.send(res)
            } else {
                res.send(400)
            }



            // return ResponseService.json(201, res, message)

        });

    });

})


// get method route
router.get('/getJobsStatus/:id', function(req, res) {

    run_id = req.params.id
    run_url = 'https://api.dataplatform.cloud.ibm.com/v2/jobs/' + job_id + '/runs/' + run_id + '?project_id=' + project_id
    console.log(req.params.id)
    request.post({
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: 'https://iam.ng.bluemix.net/identity/token',
        body: data
    }, function(error, response, body) {
        token = JSON.parse(body)
        // console.log(token.access_token);
        var Authorization = "Bearer " + token.access_token

        j_data = JSON.stringify({
            "job_run": {
                "configuration": {

                }
            }
        })

        request.get({
            headers: { "Content-Type": "application/json", "Authorization": Authorization },
            url: run_url,
        }, function(error, response, body) {

            // res.send('A job is run')
            message = JSON.parse(body)
            console.log(message.metadata)
            // return ResponseService.json(201, res, message)
            res.send(201, res, message)

        });

    });

})


module.exports = router;