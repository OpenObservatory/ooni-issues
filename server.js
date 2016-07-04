var path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    csrf = require('csurf'),
    csrfProtection = csrf({ cookie: false }),
    parseForm = bodyParser.urlencoded({ extended: false }),
    app = express(),
    port = process.env.PORT || 3000,
    router = express.Router();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// XXX re-enable
//app.use(csrfProtection);
app.use(express.static(path.join(__dirname, "public")));

router.get('/', function(req, res, next) {
  res.render('index', {
    "repositories": [
      "ooni-pipeline",
      "ooni-spec",
      "ooni-probe",
      "ooni-backend",
      "lepidopter",
    ],
    "csrfToken": ""
  });
  //, { csrfToken: req.csrfToken()});
});
router.post('/submit', parseForm, csrfProtection, function (req, res) {
  //TODO: submit issue.
});

app.use('/', router);
app.listen(port);
console.log('Listening on port', port);
