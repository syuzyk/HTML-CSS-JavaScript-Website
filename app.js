const express = require("express");
const app = express();
const path = require('path');
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/travelexperts";

//body-parser to parse through post request///
const bodyParser = require("body-parser");
const { userInfo } = require("os");
const { assert } = require("console");

//urlencoded parser to help 
var urlencodedParser = bodyParser.urlencoded({extended:true});


app.use(express.static(path.join(__dirname, './views')));
app.set("view engine", "ejs");

//connect to database
MongoClient.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
},
function(err, db) {
	if (err) {throw err;}
	var dbo = db.db("travelexperts");
dbo.collection("customers").findOne({}, function(err, result) {
	if (err) throw err;
	console.log(result.CustFirstName);
	db.close();
	});
});

//redirect after clicking on an order button//////////
app.post('/order', urlencodedParser, function (req, res) {
	console.log(req.body);
	res.render("order.ejs", { data: req.body});
	var item = {
		PkgName: req.body.PkgName,
		TravelStartDate: req.body.TravelStartDate,
		PkgDesc: req.body.PkgDesc,
		TravelEndDate: req.body.TravelEndDate,
	};
	MongoClient.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}, function(err,db){
		if (err) {throw err;}
		var dbo = db.db("travelexperts");
		dbo.collection("bookings").insertOne(item, function(err, result){
			if(err) throw err;
			console.log(item);
			db.close();
		})
	})
});

//Control: Form data from register redirects to registration-success.ejs after submitting//////////////
app.post("/send-form", urlencodedParser, function (req,res){
	console.log(req.body);
	res.render("registration-success.ejs", { data: req.body});

	var item = {
		CustFirstName: req.body.CustFirstName,
		CustLastName: req.body.CustLastName,
		CustHomePhone: req.body.CustHomePhone,
		CustAddress: req.body.CustAddress,
		CustCity: req.body.CustCity,
		CustProv: req.body.CustProv,
		CustPostal: req.body.CustPostal,
		CustEmail: req.body.CustEmail,
		passwrd: req.body.passwrd,
	};
	////insert data into db
	MongoClient.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}, function(err,db){
		if (err) {throw err;}
		var dbo = db.db("travelexperts");
		dbo.collection("customers").insertOne(item, function(err, result){
			if(err) throw err;
			console.log(item);
			db.close();
		})
	})
});



app.listen(8000, () => {
    console.log("Display Vpackage display listening on port 8000");
})

app.get('/', function (req, res) {
    res.render("mainpage.ejs", { title: "Main Page" });
});


app.get('/register', function (req, res) {
    res.render("register.ejs", { title: "Register Page" });
});

app.get('/contactus', function (req, res) {
	MongoClient.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
},
function(err, db) {
	if (err) {throw err;}
	var dbo = db.db("travelexperts");
	var agents = dbo.collection("agents");
	agents.find({}).toArray(function(err, results) {
		if (err) throw err;
		res.render("contactus.ejs", {"agents" : results});
		//db.close();
	});
	});
	
});


	
//Display vacation packages
app.get('/vpackage', function (req, res) {
	MongoClient.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	function(err, db) {
		if (err) {throw err;}
		var dbo = db.db("travelexperts");
		var packages = dbo.collection("packages");
		packages.find({}).toArray(function(err, results) {
			if (err) throw err;
			res.render("vpackage.ejs", {"packages" : results});
			//db.close();
		});
		});
});



app.use(function(req, res){
	res.status(404).render("errorpage.ejs", {title:"404 error"});
	});
	
	
