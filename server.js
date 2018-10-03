const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const app = express();
const db = mongoose.connect( 'mongodb://salary:salary123@ds121413.mlab.com:21413/salary', { useNewUrlParser: true })
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


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
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



require('./api/salaryController')(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err)=> {
     console.log(`Connted to db port ${PORT}`);
     if(err){
        console.log(err);
     }
});
