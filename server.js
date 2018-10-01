const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const app = express();
const db = mongoose.connect( 'mongodb://salary:salary123@ds119663.mlab.com:19663/salary', { useNewUrlParser: true })
                   .then(conn => conn).catch(console.error);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
//MIDDLEWARE TO CHECK DB IS CONNECTED OR NOT
app.use((req, res, next)=>{
    Promise.resolve(db)
           .then((connetion, err)=>{
                if(typeof connetion !== 'undefined'){
                   next();
                }else{
                   next(new  Error('Mongo Error'))
                }
           });
});

app.use(session({
         secret: 'mysecret@123',
         resave: false,
         saveUninitialized: true,
         store: new MongoStore({
             collection: 'sessions',
             mongooseConnection: mongoose.connection,
             ttl: 1*60*60
         })
}));

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

require('./api/salaryController')(app);

app.listen('4000', (err)=> {
     console.log("Connted to db port 4000");
     if(err){
        console.log(err);
     }
});
