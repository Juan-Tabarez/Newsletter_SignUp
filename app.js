const mailchimp = require("@mailchimp/mailchimp_marketing");
const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
//Para hacer request
const https = require("https");

const app = express();

//Para poder usar el body-parser (agarrar la info de los inputs con sus name como variables)
app.use(bodyParser.urlencoded({extended:true}));
//Para poder usasr archivos locales (estaticos).
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
    apiKey: "04499f277c5a9114e407b9ffc1e26fec-us9",

    server: "us9"
})

app.post("/", function(req, res){
    
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const listId = "fc3dc7fa34";

    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };

    async function run(){
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
    }
    });
    
    res.sendFile(__dirname + "/success.html")
    console.log(
   `Successfully added contact as an audience member. The contact's id is ${
    response.id
    }.`
   );
   }

   run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/success", function(req, res){
    res.redirect("/");
})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000")
});

//API Key
//04499f277c5a9114e407b9ffc1e26fec-us9  

//List ID
//fc3dc7fa34