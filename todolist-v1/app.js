const express = require('express')
const bodyParser = require('body-parser')
const date = require(__dirname + "/date.js")

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));//public file for css

app.set('view engine', 'ejs');//ejs

const port = 3000

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.get('/', (req, res) => {

    const day = date.getDate();

    //using ejs
    res.render('list', { listTitle: day, newListItems: items });//var name litstTitle and value day


})

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/work', (req, res) => {
    res.render('list', { listTitle: "Work", newListItems: workItems });
})


app.post('/', (req, res) => {
    let item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect('/work')
    } else {
        items.push(item);
        res.redirect('/');
    }
})






app.listen(port, () => {
    console.log(`_________________________________________${port}____________________________________________________________`)
})