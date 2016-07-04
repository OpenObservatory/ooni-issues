var path = require('path'),
    express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    router = express.Router();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

router.get('/', function(req, res, next) {
  res.render('index.html');
});
app.use('/', router);
app.listen(port);
console.log('Listening on port', port);
