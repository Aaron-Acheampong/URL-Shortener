require('dotenv').config();
const shortid = require('shortid');
const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const database_uri = 'mongodb+srv://Aaron-Syl_7:Sabbathday7@cluster0.klrsp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
//mongoose.connect(process.env.DB_URI);
mongoose.connect(database_uri, { useNewUrlParser: true, 
  useUnifiedTopology: true });



app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


const ShortURL = mongoose.model('ShortURL', new mongoose.Schema({ 
  short_url: String , 
  original_url: String, 
  suffix: String
}));

app.use(bodyParser.urlencoded({ extended: false}));

app.use(bodyParser.json());


const jsonParser = bodyParser.json();

app.post("/api/shorturl/new/", jsonParser, (req, res) => {

  
  let client_requested_url = req.body.url;
  let suffix = shortid.generate();
  let newShortURL = suffix

  let newURL = new ShortURL({
    short_url: __dirname + "/api/shorturl/" + suffix, 
    original_url: client_requested_url, 
    suffix: suffix
  })

  newURL.save( (err, doc) => {
    if(err) return console.error(err);
  
  res.json({
    "saved": true, 
    "short_url": newURL.short_url,
    "original_url": newURL.original_url, 
    "suffix": newURL.suffix
  });
});
});


app.get("/api/shorturl/:suffix", (req, res) => {
  let userGeneratedSuffix = req.params.suffix;
  ShortURL.find({suffix: userGeneratedSuffix}).then(foundUrls => {
    let urlForRedirect = foundUrls[0];
    res.redirect(urlForRedirect.original_url);
    res.json ({
      "userGeneratedSuffix": userGeneratedSuffix, 
      "userRequestedUrl": userRequestedUrl  
    });

  });
  console.log(userRequestedUrl, " <= userRequestedUrl ");
    
  });


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
