var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var bcrypt = require("bcrypt-nodejs");
var session = require('express-session')
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');

// require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// app.use(express.static(path.join(__dirname, '/dist')));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/meanFolio');

var ProductSchema = new mongoose.Schema({
    name: {type: String, minlength: 3},
    img: {type: String, minlength: 1},
    price: {type: Number, min: 0.01},   
})
mongoose.model('Product', ProductSchema);
var Product = mongoose.model('Product');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var UserSchema = new mongoose.Schema({
    username: {type: String, required:'please type a username',unique: true, trim: true, minlength: 2},
    email: {type: String, lowercase: true, unique: true, required:'email address is required', validate: [validateEmail, 'Please fill a valid email address'],match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], trim: true},
    password: {type: String, minlength: 6, required: true},
    passwordConf: {type: String, required: true}
})
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
})
// UserSchema.path('password').validate(function(v) {
//     if (this._password || this._passwordConf) {
//       if (!val.check(this._password).min(6)) {
//         this.invalidate('password', 'must be at least 6 characters.');
//       }
//       if (this._password !== this._passwordConfirmation) {
//         this.invalidate('passwordConf', 'must match confirmation.');
//       }
//     }
// })
mongoose.model('User', UserSchema);
var User = mongoose.model('User');

//create a user
app.post('/api/newUser', (req,res)=>{
    console.log("SERVER.JS AAAAAAAAAAAAAAAAAAAAAAAAAAA")
    var newUser = new User({username: req.body.username, email: req.body.email, password: req.body.password, passwordConf: req.body.passwordConf});
    console.log()
    newUser.save(function(err){
        if(err){
            res.json(err);
        }else{
            console.log("user created")
            res.json(newUser);
        }
    })
})

app.get('/', function(req, res) {
    res.render('index.ejs'); // load the index.ejs file
});
// show the login form
app.get('/login', function(req, res) {

// render the page and pass in any flash data if it exists
res.render('login.ejs', { message: req.flash('loginMessage') }); 
});

// process the login form
// app.post('/login', do all our passport stuff here);

  // show the signup form
app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
});

// process the signup form
// app.post('/signup', do all our passport stuff here);

// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
        user : req.user // get the user out of session and pass to template
    });
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


//get all products
app.get('/api/products', (req,res)=>{
    Product.find({}, (err, foundProducts)=>{
        if (err) {
            res.json(err);
        } else {
            res.json(foundProducts);
        }
    })
})

//get one product
app.get('/api/products/:id', (req,res)=>{
    if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
        Product.findOne({_id: req.params.id}, (err, foundProduct)=>{
            if (err) {
                console.log("YOOOOOOOOOOOOOOOOOOO");
                res.json(err);
            } else {
                console.log("YEEEEEEEEEEEEEEEEEEEEEE");
                res.json(foundProduct);
            }
        })
    }else{
        console.log('ELSEEEEEEEEEEEEEEEEEEE');
        res.json(err);
    }
})

//add bids
app.put('/api/products/:id', (req,res)=>{
    Product.findOne({ _id: req.params.id }, (err, foundProduct) => {
        if (err) {
            res.json(err);
        } else {
            foundProduct.price += 0.01
            foundProduct.save((err)=>{
                if(err){
                    res.json(err);
                }else{
                    res.json(foundProduct);
                }
            })
        }
    })
})

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./dist/index.html"))
});

app.listen(8000, ()=>{
    console.log('listening on port 8000');
});