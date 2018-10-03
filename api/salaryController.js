const Salary = require('../models/salary');
module.exports = api => {

api.get('/', (req, res)=>{
    res.send({
        Hi : "api is running properly"
    })
})

api.get('/salary', async (req, res) => {
  const salary = Salary.find();
  let queryParams = req.query || null;
  if(queryParams){
    if(queryParams['offset']){
      salary.skip(parseInt(queryParams['offset']));
      delete queryParams['offset'];
    }
    if(queryParams['limit']){
       salary.limit(parseInt(queryParams['limit']));
       delete queryParams['limit'];
    }
  }
  let dbColumnNames = Object.keys(salary.schema.obj);
  try {
    for(key in queryParams){
        if(dbColumnNames.indexOf(key)<0)
           throw new Error(`undefined param ${key}`);
        salary.where(key).equals(queryParams[key]);
    }
    let result = await salary;
    res.json({
       status: 200,
       salarys : result
    })
  }catch(error){
    res.json({
       status: 403,
       error : error.message
    })
  }
})

api.post('/salary', async (req, res)=>{
    try {
      const { city_name, designation_name, work_experience} = req.body;
      const salary =  new Salary(req.body);
            await salary.save((result)=>{
              console.log(result);
              res.json({
                 status: 200,
                 data: salary
              });
            })
    }catch (error){
      res.json({
          status: 403,
          error  : error.message
      });
   }
})
// api.post('/signup', isNotLogged, async (req, res)=>{
//     try {
//       const {session, body}  = req;
//       const {name, username, email, password} = body;
//       const user = await User.signup(name, username, email, password);
//       session.user = {
//           _id : user._id,
//           user: user.username
//       }
//       session.save(()=>{
//           res.json({
//               status: 200,
//               user : session.user
//           })
//       });
//       res.status(200).json({
//           status: "Created!",
//           user : user
//       })
//     }catch (error) {
//       res.json({
//           status: 403,
//           error  : error.message
//       })
//     }
//   })
}
