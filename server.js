require('dontenv').config()
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const cors = require('cors');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

connectDB();

app.use(cors());

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use('/',express.static(path.join(_dirname, '/public' )));

app.use('/', require('.routes/root'));

app.use('/states/', require('./routes/api/states'));

app.all('*' (req,res) => {
	res.status(404);

	if (req.accepts('html')) {
	res.sendFile(path.join(_dirname,'views', '404.html'));
	}
	else if (req.accepts('json')) {
	res.json({error:'404 Not Found'});
	}

	else {
	res.type('txt').send('404 Not Found');
	}
});