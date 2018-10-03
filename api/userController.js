const User = require('../models/user');
const Book = require('../models/book');
module.exports = api => {
  const isLogged = ({session}, res, next)=>{
     if(!session.user){
         res.json({
           error : "You are not logged in",
           status:  403
       })
     }else
       next();
  }

  const isNotLogged = ({ session }, res, next)=>{
     if(session.user){
         res.json({
           error : "You are logged in",
           status:  403
       })
     }else
       next();
  }
  api.post('/login', isNotLogged, async (req, res)=>{
      try {
        const {session, body} = req;
        const {username, password} = body;
        const user = await User.login(username, password);
        session.user = {
            _id : user._id,
            user: user.username
        }
        session.save(()=>{
            res.json({
                status: 200,
                user : session.user
            })
        });
      } catch (error) {
        res.json({
            status: 403,
            error: error.message
        });
      }
  });

api.post('/logout', isLogged, (req, res) => {
	req.session.destroy();
	res.json({
     status : 200,
     message : 'Bye bye!'
  })
})


api.get('/books', async (req, res) => {
  const book = Book.find();
  let queryParams = req.query || null;
  if(queryParams){
    if(queryParams['offset']){
      book.skip(parseInt(queryParams['offset']));
      delete queryParams['offset'];
    }
    if(queryParams['limit']){
       book.limit(parseInt(queryParams['limit']));
       delete queryParams['limit'];
    }
  }
  let dbColumnNames = Object.keys(book.schema.obj);
  try {
    for(key in queryParams){
        if(dbColumnNames.indexOf(key)<0)
           throw new Error(`undefined param ${key}`);
        book.where(key).equals(queryParams[key]);
    }
    let result = await book;
    res.json({
       status: 200,
       books : result
    })
  }catch(error) {
    res.json({
       status: 403,
       error : error.message
    })
  }
})

api.post('/signup', isNotLogged, async (req, res)=>{
    try {
      const {session, body}  = req;
      const {name, username, email, password} = body;
      const user = await User.signup(name, username, email, password);
      session.user = {
          _id : user._id,
          user: user.username
      }
      session.save(()=>{
          res.json({
              status: 200,
              user : session.user
          })
      });
      res.status(200).json({
          status: "Created!",
          user : user
      })
    }catch (error) {
      res.json({
          status: 403,
          error  : error.message
      })
    }
  })
}
