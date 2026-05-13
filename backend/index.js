const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();

require('./config/db')

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-id', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./routes')(app)

app.listen(3001, (err) => {
  if (err) { console.log(err) }
  else { console.log('Server started at port http://localhost:3001') }
})