const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000
const path = require('path')
const bodyParser = require('body-parser');

// Configure your domain here
const auth0Domain = "YOUR-AUTH0-DOMAIN-HERE";

app.use(bodyParser.urlencoded({ extended: false}));

// setup the view engine
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

// routes
app.get('/consent', (request, response) => {
  if (!request.query.state) {
    response.end("No state was found.");
  } else {
    response.render('consent', {
      title: "Consent form",
      state: request.query.state
    });
  }
});

app.post('/consent', (request, response) => {
  if (!request.body.state) {
    response.end("No state was found.")
  } else {
    response.redirect(`https://${auth0Domain}/continue?state=${request.body.state}&confirm=${request.body.confirm || "no"}`);
  }
});

// server
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})