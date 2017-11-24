let express = require('express');
let queries = require('./app/queries');
let pages = require('./app/pages');

let app = express();

app.use(express.static('frontend'));
app.use(express.static('uploads'));
pages(app);
queries(app);

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
