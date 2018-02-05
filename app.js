const express           = require("express");
const bodyParser        = require("body-parser");
const mongoose          = require("mongoose");
const methodOverride    = require("method-override");
var passport            = require("passport");
var LocalStrategy       = require("passport-local");
var flash               = require("connect-flash");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect("mongodb://localhost/datingapp");

//MODEL IMPORTS
const User = require("./models/user.js");


//PASSPORT
app.use(require("express-session")({
    secret: "secretty",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//FORM Questions
const form= [
    "I am a feminist" ,
    "I have smoked marijuana in my life",
    "I support the United States",
    "I would be open to dating a transsexual person",
    "I like tattoos",
    "I use at least 3 social media every day",
    "I believe in evolution",
    "I make jokes about autism",
    "I believe in a universal power or God",
    "I would not want my children to be gay/lesbian",
    "I support conservative politicians",
    "I speak more than two language",
    "I do not trust the integrity of the police",
    "I would be interested in living in a farming commune",
    "I like to drink alcohol",
    "I like capitalism",
    "I think spanking children is reasonable",
    "I like guns",
    "I enjoy watching terrible movies to laugh at them",
    "I attend protests",
    "I support the death penalty",
    "I do not like the idea of genetically engineered foods",
    "I go to coffee shops",
    "I like jazz music",
    "I like rap music",
    "I think horoscopes are fun",
    "I enjoy visiting the zoo",
    "I believe that religion is foolish",
    "I support home-schooling",
    "I like opera singing",
    "I would not like my child to marry someone of a different race",
    "I think cosplay (dressing up as fiction characters) is stupid",
    "I would never go to a dance club",
    "I think all drugs ought to be legalized",
    "I am interested in the Dungeons & Dragons role playing game",
    "Fictional stories is one of my most common conversational topics",
    "I want to own an expensive car",
    "I am disgusted by drunken people",
    "I think criminal convicts should be forced to work",
    "I am disgusted by obesity",
    "I eat at fast food restaurants",
    "I like death metal music",
    "I like to go camping and hiking",
    "I would never send my children to a private high school",
    "I think I have seen a ghost",
    "I do not like nose rings",
    "Sexual jokes make me uncomfortable",
    "It's okay to have one night sex",
    "I often argue with people about feminism and sexism",
    "I love large parties",
    "I believe that soldiers are heroes",
    "I think it is wrong to use students discounts after graduation",
    "I have played a lot of video games",
    "I laugh at people who do stupid things and get hurt",
    "I share funny internet videos with people a lot",
    "I love animation movies",
    "I laugh at jokes that would offend some people",
    "I think long hair on men looks bad",
    "I watch cartoons",
    "I think poverty in Africa is mostly the fault of European colonialism",
    "There are important biological brain differences between men and women",
    "I do not think politics is worth getting mad about",
    "I am wearing headphones most of the time",
    "I think vegetarianism is stupid",
    "I think about how I would survive a zombie apocalypse",
    "I have travelled alone in a foreign country",
    "I like super hero movies",
    "I would like to climb Mt Everest",
    "I spend a lot of time on the internet",
    "I trust in luck",
    "I am disgusted by cigarette smoking",
    "I get annoyed by people kissing in public",
    "I am nerdy",
    "I hate gossip and people who gossip",
    "I enjoy wrestling with my friends",
    "I would like to be a hacker",
    "I take care to recycle",
    "I give money to the homeless",
    "I think IQ is nonsense",
    "I do not respect copyright laws",
    "I prefer to eat at expensive restaurants",
    "I think hitchhiking should be illegal"
    ];


//MAIN PART
app.get("/", (req, res)=> {
    res.render("index", {pageName: "index"});
});

app.get("/login", (req, res) => {
   res.render("login"); 
});

app.get("/register", (req, res) => {
   res.render("register"); 
});

app.get("/form", (req, res)=>{
    res.render("form", {form: form});
});


app.get("/user/:id", (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err){
            console.log(err);
        } else {
                res.render("profile", {user: user});

        }
    });
    
});

//FORM POST
app.post("/form", (req, res) => {
    User.findById(req.user._id, (err, user)=> {
       if(err) {
           console.log(err);
       } else {
           user.infos = req.body;
           user.save();
           res.redirect("/")
       }
    });
});



//USER ROUTES

app.post("/register", (req, res)=>{
    User.register(new User({username: req.body.username, age: req.body.age, sex: req.body.sex}), req.body.password, (err, user) => {
       if(err) {
           console.log(err);
           res.redirect("/register");
       } else {
           passport.authenticate("local")(req, res, ()=> {
               res.redirect("/");
           });
       }
    });
});

app.post("/login",passport.authenticate("local", {
    successRedirect: "/form",
    failureRedirect: "/login"
}), (req, res)=> {
    console.log("Logged In");
});

app.get("/logout", (req, res)=>{
    req.logout();
    res.redirect("/");
})


//LISTEN
app.listen(process.env.PORT, process.env.IP, ()=> console.log("Server has started!"));