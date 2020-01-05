const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  var jsonData = JSON.stringify(data);

  var options = {
    url:"https://us4.api.mailchimp.com/3.0/lists/756d7e5a6f",
    method: "POST",
    headers: {
      "Authorization": "arunc_212 6b5dad899127e982168012bea69c4a73-us4"
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    if(error) {
      console.log(error);
      res.sendFile(__dirname + "/failure.html");
    }
    else {
      console.log(response.statusCode);
      if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      }
      else {
        res.sendFile(__dirname + "/failure.html");
      }
    }

  });
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
})
