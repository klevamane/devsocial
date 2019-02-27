import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import users from './routes/api/users';
import profile from './routes/api/profile';
import posts from './routes/api/posts';



const app = express();

// body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

import connect from './config/keys';
import { mongoURIconnect } from './config/keys';

mongoose
    .connect(mongoURIconnect)
    .then(() => console.log('MongoDb successfully connected'))
    .catch(err => console.log(`An error occoured in connecting to the database, error: ${err}`))

app.get('/', (req, res) => res.send('Displaying the server data'));
app.use('/api/v1/profile', profile);
app.use('/api/v1/posts', posts);
app.use('/api/v1/users', users);

let port = process.env.PORT || 5000;
app.listen(port, () => console.log(`The server is running on port ${port}`));