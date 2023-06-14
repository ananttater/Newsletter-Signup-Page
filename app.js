const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require('@mailchimp/mailchimp_marketing');
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userEmail = req.body.email;

    const data = {
        email_address: userEmail,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/a7a1d0ae3f/members"
    const options = {
        method: "POST",
        auth: "ananttater:52ebd03a15753354eef67f58e4cb2eeb-us21"
    }

    const request = https.request(url, options, function(responce){

        if(responce.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        } else{
            res.sendFile(__dirname+"/failure.html");
        }

        responce.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 1805, function(){
    console.log("Server is up & running on 1805 port.")
});

// audience_id = a7a1d0ae3f
// var api_key = "52ebd03a15753354eef67f58e4cb2eeb-us21";