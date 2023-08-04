require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require('connect-flash');

const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));



app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  }));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/pawlibDB", {useNewUrlParser: true});


const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    version: String,
    department: String,
    Link: String
});

const Book = mongoose.model("Book", bookSchema);

const departmentSchema = new mongoose.Schema({
    title: String,
    faculty: String,
    books:[bookSchema]
});
const Department = mongoose.model("Department", departmentSchema);

const facultySchema = new mongoose.Schema({
    title: String,
    depts: [departmentSchema]
});
const Faculty = mongoose.model("Faculty", facultySchema);

const userschema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    googleId: String,
    books: [bookSchema]
});
userschema.plugin(passportLocalMongoose);
userschema.plugin(findOrCreate);

const User = mongoose.model("User", userschema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
      });
    });
  });
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile)

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/google',
    passport.authenticate('google', { scope: ["profile"] })
    );

app.get("/auth/google/secrets", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/home');
    });

app.get("/logout", (req, res)=>{
    req.logOut(function(err){
        console.log(err);
    });
    res.redirect("/");
});


app.get("/", function(req, res){
    res.render("about");
});

app.route("/home")
    .get(async (req, res)=>{
        if (req.isAuthenticated()){
            let manager = false;
            if (req.user.username === "ebi1926b@gmail.com"){
                manager = true;
            }
            const faculty = await Faculty.find({});
            res.render("home", {faculties: faculty, manager: manager});   
        }else{
            res.redirect("/login");
        } 
    });

app.route("/register")
    .get((req, res)=>{
        res.render("register");
    })
    .post( (req, res)=>{
        User.register({username: req.body.username}, req.body.password, function(err, user){
            if (err) {
              req.session.messages = err.message
              res.redirect("/login");
            } else {
              passport.authenticate("local")(req, res, function(){
                res.redirect("/home");
              });
            }
          });
        
        });



app.get("/login",(req, res)=>{
        var passedVariable = req.session.messages;
        
        req.session.valid = null;
        req.flash("Wrong Entry")
        res.render("login", {passedVariable: passedVariable});
    });

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureMessage: true}), function(req, res) {
    res.redirect('/home');
  });


app.get("/page/:pageid", async (req, res)=>{
    if (req.isAuthenticated()){
        let manager = false;
            if (req.user.username === "ebi1926b@gmail.com"){
                manager = true;
            }
        const gotoPage = req.params.pageid;
        const faculty = await Faculty.find({});
        const department = await Department.findOne({_id: gotoPage});
        res.render("page", {faculties:faculty, department: department, manager: manager});   
    }else{
        res.redirect("/login");
    } 
   
})
app.route("/install")
    .get((req, res)=>{
        res.render("")
    })

app.get("/faculty", async function(req, res){
   const faculty = await Department.find().lean()
   res.json(faculty)
});





app.listen(3000, (req, res)=>{
    console.log("Server is running on port 3000")
});