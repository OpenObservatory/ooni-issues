var path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    csrf = require('csurf'),
    fs = require('fs'),
    githubApi = require('github'),
    csrfProtection = csrf({ cookie: false }),
    parseForm = bodyParser.urlencoded({ extended: false }),
    app = express(),
    port = process.env.PORT || 3000,
    router = express.Router(),
    config = JSON.parse(fs.readFileSync('config.json')),
    github = new githubApi({}),
    repos = {
      "Probe": "ooni-probe",
      "Website": "ooni-web",
      "Explorer": "ooni-explorer",
      "Lepidopter": "lepidopter"
    };

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "public")));

router.get('/', csrfProtection, function(req, res, next) {
  res.render('index', {
    "repositories": Object.keys(repos).map(r => repos[r]),
    "csrfToken": req.csrfToken
  });
});


router.post('/submit', parseForm, csrfProtection, function (req, res) {
  github.authenticate({
    type: "oauth",
    token: config.token
  });
  try {
    github.issues.create({
      user: config.user,
      repo: repos[req.body.repo] || "ooni-probe",
      title: req.body.title,
      body: req.body.body,
      labels: ["Autosubmitted"]
    }, function (err, resp) {
      if (err) {
        res.render('error');
      } else {
        res.render('success', {
          resp: resp
        });
      }
    });
});

app.use('/', router);
app.listen(port);
console.log('Listening on port', port);
