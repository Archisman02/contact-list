const express = require("express");
const path = require("path"); //path is an inbuilt module so we do not need to install using npm
const bodyParser = require("body-parser");
const port = 8000;

const db = require("./config/mongoose");
const Contact = require("./models/contact");

const app = express(); //To fire the express and get all functionalities

app.set("view engine", "ejs"); // setting of
app.set("views", path.join(__dirname, "views")); // template(view) engine
app.use(
  bodyParser.urlencoded({
    // This is a middleware
    extended: false,
  })
);
app.use(express.static("assets"));
// Middleware1
// app.use(function (req, res, next) {
//   console.log("middleware 1 called");
//   next();
// });

var contactList = [
  {
    name: "Archisman",
    phone: "9830405666",
  },
  {
    name: "Pampa",
    phone: "9830205666",
  },
  {
    name: "Tinku",
    phone: "9853935036",
  },
];

app.get("/", function (req, res) {
  //   console.log(__dirname);
  //   res.send("<h1>Cool, it is running! or is it?</h1>");
  Contact.find({}, function (err, contacts) {
    if (err) {
      console.log("error in fetching contacts from db");
      return;
    }

    return res.render("home", {
      title: "Contacts List", // This part is called
      contact_list: contacts, // context and will be a part of local.
    });
  });
});

app.get("/practice", function (req, res) {
  return res.render("practice", {
    title: "Let us play with ejs",
  });
});

app.post("/create-contact", function (req, res) {
  // return res.redirect("/practice");
  // console.log(req.body);
  // contactList.push({
  //   name: req.body.name,
  //   phone: req.body.phone,
  // });

  // contactList.push(req.body);
  Contact.create(
    {
      name: req.body.name,
      phone: req.body.phone,
    },
    function (err, newContact) {
      if (err) {
        console.log("error in creating a contact!");
        return;
      }

      console.log("*********", newContact);
      return res.redirect("back"); // or return res.redirect('/')
    }
  );
});

// for deleting a contact
app.get("/delete-contact", function (req, res) {
  // console.log(req.params);
  console.log(req.query);
  // get the query from the url
  // let phone = req.query.phone;

  // let contactIndex = contactList.findIndex((contact) => contact.phone == phone);

  // if (contactIndex != -1) {
  //   contactList.splice(contactIndex, 1);
  // }

  // get the id from query in the url
  let phone = req.query.phone;

  // find the contact in the database using id and delete
  Contact.deleteOne({ phone: phone }, function (err) {
    if (err) {
      console.log("error in deleting an object from database");
      return;
    }

    return res.redirect("back");
  });
});

app.listen(port, function (err) {
  if (err) {
    console.log("Error in running the server", err);
    return;
  }

  console.log("Yup!My server is running on port:", port);
});
