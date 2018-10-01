const {connection, Schema} = require('mongoose');
const crypto = require('crypto');

const UserSchema = new Schema({
    name : {
       type : String,
       minlength : 2,
       trim: true,
       lowercase: true,
       maxlength : 20,
       required: [true, 'name is required'],
       validate : {
            validator : function(value){
                return /^[\w]+$/.test(value);
            },
            message : '{VALUE} is not valid name'
       }
    },
    username : {
       type: String,
       minlength : 4,
       trim: true,
       lowercase: true,
       maxlength : 20,
       required: [true, 'username is required'],
       validate : {
           validator : function(value){
               return /^[A-Za-z]+$/.test(value);
           },
           message : '{VALUE} is not a valid username'
       }
    },
    email : {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'email is required'],
        validate : {
            validator : function(value){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
            },
            message : '{VALUE} is not a valid email'
        }
    },
    password : String
})

UserSchema.static('signup', async function(name, usr, email,  pwd){
    if(pwd.length < 6){
       throw new Error("Pwd must have more than 6 chars");
    }
    const hash = crypto.createHash('sha256').update(String(pwd));
    const exist = await this.findOne({ $or : [{'username': usr}, {'email': email}]});
    if(exist && exist.username==usr)
       throw new Error("username already exists");
    else if(exist && exist.email==email)
       throw new Error("email already exists");
    const user = this.create({
          name : name,
          username: usr,
          email : email,
          password: hash.digest('hex')
    });
    return user;
});

UserSchema.static('login', async function(usr, pwd){
    const hash = crypto.createHash('sha256').update(String(pwd));
    const user = this.findOne({username: usr, password: hash.digest('hex')});
    if(!user)
       throw new Error("invalid login credentials");
    delete user.password;
    return user;
});


//console.log(connection.db('books').collection('books').find({}));
module.exports = connection.model('user', UserSchema)
