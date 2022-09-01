const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemSchema = {
  name: String
};
const Item = mongoose.model('item', itemSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});
const item2 = new Item({
  name: "Hit the + button to add a new item"
});
const item3 = new Item({
  name: "<-- Hit this to delete an item"
});
const defaultItems = [item1, item2, item3];

//random links
const listSchema = {
  name: String,
  items: [itemSchema]
};
const List = mongoose.model('List', listSchema);

app.get("/", (req, res) => {

  Item.find({}, (err, items) => { //find all item
    if (items.length === 0) {//check the found is zero, if zero add the default items
      Item.insertMany(defaultItems, (err) => { if (err) console.log(err); else console.log("Succesfully saved default items to DB"); });
      res.redirect('/');
    } else {
      res.render("list", { listTitle: "Today", newListItems: items });
    }
  });

});

app.post("/", (req, res) => {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect('/');
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      if (!err) {
        foundList.items.push(item);
        foundList.save();
        res.redirect('/' + listName);
      }
    });
  }
});

app.post('/delete', (req, res) => {
  const checkedItemid = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemid, (err) => {
      if (err) console.log(err); else console.log("Removed");
      res.redirect('/');
    });
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemid } } }, (err, result) => {
      if (!err) {
        res.redirect('/' + listName);
      }
    });
  }

});

app.get('/:name', (req, res) => {
  const customListName = _.capitalize(req.params.name);

  List.findOne({ name: customListName }, (err, foundItem) => {
    if (!err) {
      if (!foundItem) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect('/' + customListName);
      } else {
        res.render('list', { listTitle: foundItem.name, newListItems: foundItem.items });
      }
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
