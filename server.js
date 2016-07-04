var path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    csrf = require('csurf'),
    fs = require('fs'),
    githubApi = require('github'),
    session = require('express-session'),
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
    },
    gh_token = process.env.GH_TOKEN || config.token;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  resave: false,
  secret: config.secret,
  saveUninitialized: true
}));

router.get('/', csrfProtection, function(req, res, next) {
  res.render('index', {
    "repositories": Object.keys(repos).map(function(r) {return repos[r];}),
    "csrfToken": req.csrfToken()
  });
});


router.post('/submit', parseForm, csrfProtection, function (req, res) {
  var repo =  repos[req.body.repo] || "ooni-probe";
  github.authenticate({
    type: "oauth",
    token: gh_token
  });
  github.issues.create({
    user: "thetorproject",
    repo: repo,
    title: req.body.title,
    body: req.body.body,
    labels: ["Autosubmitted"]
  }, function (err, resp) {
    if (err) {
      console.error(err);
      res.render('error');
    } else {
      res.render('success', {
        repo_url: resp.html_url
      });
    }
  });
});

app.use('/', router);
app.listen(port);
console.log('Listening on port', port);
