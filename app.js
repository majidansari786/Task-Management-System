const express = require('express');
const auth_route = require('./routers/user_auth')
const app = express();
const bodyParser = require('body-parser');
const { configDotenv } = require('dotenv');
require('./config/db');
require('dotenv').config();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/auth', auth_route);

app.get('/',(req,res)=>{
    res.send('Hello');
});

app.listen(3000, ()=>{
    console.log('Server started at port 3000');
});