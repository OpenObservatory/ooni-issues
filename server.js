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
    github = new githubApi({});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

router.get('/', function(req, res, next) {
  res.render('index.html', { csrfToken: req.csrfToken()});
});


router.post('/submit', parseForm, csrfProtection, function (req, res) {
  github.authenticate({
    type: "oauth",
    token: config.token
  });
  github.issues.create({
    user: config.user,
    repo: config.repo,
    title: "Test Issue",
    body: "Issue Body",
    labels: ["Autosubmitted"]
  });
});

app.use('/', router);
app.listen(port);
console.log('Listening on port', port);
