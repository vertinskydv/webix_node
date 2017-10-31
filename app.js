let express = require('express');
let queries = require('./js/queries');
let pages = require('./js/pages');

let app = express();

app.use(express.static('frontend'));
pages(app);
queries(app);

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
