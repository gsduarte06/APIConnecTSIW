const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors'); 


const host = process.env.HOST || '127.0.0.1' ; const port = process.env.PORT || 8080;

app.use(cors()); 
app.use(express.json()); //enable parsing JSON body data
// root route -- /api/
app.get('/', function (req, res) {
res.status(200).json({ message: 'home -- ConnecTSIW api' });
});
// routing middleware for resource Users
app.use('/users', require('./routes/users.routes.js'))

app.use('/backgrounds', require('./routes/backgrounds.routes.js'))

app.use('/posts', require('./routes/posts.routes.js'))

app.use('/comments', require('./routes/comments.routes.js'))

app.use('/positions', require('./routes/positions.routes.js'))

app.use('/districts', require('./routes/districts.routes.js'))

app.use('/type_posts', require('./routes/type_posts.routes.js'))

// handle invalid routes
app.all('*', function (req, res) {
res.status(404).json({ message: 'Resource not found' });
})
app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));