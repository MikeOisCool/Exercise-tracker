const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
let _id = 0
let users = [];

app.post('/api/users', (req, res) => {
  const uname = req.body.username
  _id++
  let newUser = {
    username: uname,
    _id: _id.toString(),
    exercises: []
  };
  users.push(newUser)
  res.send({
    username: newUser.username,
    _id: newUser._id
  });
  
 
})

app.get('/api/users', (req, res) => {
  res.send(users)
})




app.post('/api/users/:id/exercises', (req, res) => {
  const userId = req.params.id;
  
  const user = users.find(u => u._id === userId)
  if (!user) {return res.json({ error: "User not found"})}
  console.log("User found:", user);
  const description = req.body.description
  const duration = parseInt(req.body.duration);
  
  let date = req.body.date ? new Date(req.body.date) : new Date();
  date = date.toDateString();

  let newExercise = {
    username: user.username,
    description: description,
    duration: duration,
    date: date
    
  }

  user.exercises.push(newExercise);
  
  res.json({
    username: user.username,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date,
    _id: user._id
  })

})

app.get('/api/users/:id/exercises', (req, res) => {
  const userId = req.params.id;
  const user = users.find(u => u._id === userId)

  if (!user) { return res.json({ error: "User not found"})}
  
  
  res.json(user.exercises);
});

app.get('/api/users/:id/logs', (req, res) => {
  const userId = req.params.id;
  const user = users.find(u => u._id === userId)

  

  if (!user) { return res.json({ error: "User not found"})}
  let log = user.exercises.map(exercise => ({description: exercise.description,
    duration: exercise.duration,
    date: exercise.date}));

  const { from, to, limit } = req.query;

  let logs = {
    username: user.username,
    count: user.exercises.length,
    _id: userId,
    log
    };

    if (from) {
      log = log.filter(exercise => new Date(exercise.date) >= new Date(from));
    }
  
    if (to) {
      log = log.filter(exercise => new Date(exercise.date) <= new Date(to));
    }
  
    // Limit der zurückgegebenen Einträge
    if (limit) {
      log = log.slice(0, parseInt(limit));
    }

  console.log("log" ,logs)
  res.json({username: user.username,
    count: log.length, // Anzahl der gefilterten Übungen
    _id: userId,
    log: log})
})

// formatDate = (date) => {
//   const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};
//   const formattedDate = date.toLocaleDateString('en-US', options);

//   return formattedDate.replace(',', '');
// }


const listener = app.listen(process.env.PORT || 3001, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


