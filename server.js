var path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    csrf = require('csurf'),
    csrfProtection = csrf({ cookie: false }),
    parseForm = bodyParser.urlencoded({ extended: false }),
    app = express(),
    port = process.env.PORT || 3000,
    router = express.Router();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

router.get('/', function(req, res, next) {
  res.render('index.html', { csrfToken: req.csrfToken()});
});
router.post('/submit', parseForm, csrfProtection, function (req, res) {
  //TODO: submit issue.
});

app.use('/', router);
app.listen(port);
console.log('Listening on port', port);
