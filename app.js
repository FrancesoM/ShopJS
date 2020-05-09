const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app  = express();
const rca = require("rainbow-colors-array");

// Connect to the database
mongoose.connect('mongodb://localhost/Shop')
let db = mongoose.connection

//Check connection
db.once('open',function(){
  console.log("connected to mongodb")
})

//Check errors
db.on('error',function(err){
  console.log(err);
});

// parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug')

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Bring in Models, where we have exported the schema
let CustomersCollection = require('./models/customer')


// Home route
app.get('/',function(req,res){
  CustomersCollection.find({}, function(err,customers){
    if(err){
      console.log(err)
    }
    else {
      let rainbow = rca(customers.length,"rgb")
      customers.forEach((item, i) => {
        let r = rainbow[i].r
        let g = rainbow[i].g
        let b = rainbow[i].b
        let color_to_be_set = "rgb("+r+","+g+","+b+")"
        item.color = color_to_be_set
      });

      res.render('index',{
        title:"Customers",
        customers: customers
      })
    }
  })
});

// Add route
app.get('/customers/add', function(req,res){
  res.render("add_customer",{
    title:"Upload the customer informations"
  })
})

// Add post route
app.post('/customers/add', function(req,res){
  let customer = new CustomersCollection();
  customer.name = req.body.name;
  customer.surname = req.body.surname

  customer.save(function(err){
    if(err){ console.log(err); return;}
    else{
      res.redirect("/")
    }
  })

})

// Get single customer - column means it's a placeholder
app.get("/customer/:id", function(req,res){
  CustomersCollection.findById(req.params.id, function(err,customer){
    res.render('customer', {
        customer:customer
    });
  });
});

// Delete single customer
app.get("/customer/delete/:id", function(req,res){
  CustomersCollection.deleteOne({ "_id": req.params.id }, function(err){
    if(err) { console.log(err); return; }
    else{
      res.redirect("/")
    }
  });
});


// Start server
app.listen(3000,function(){
  console.log('Server started on port 3000...')
});
