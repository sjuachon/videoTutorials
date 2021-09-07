const express = require('express');
const route = express.Router();
const exphbs = require('express-handlebars');
const Course = require('../models/Course');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { on, off } = require('../models/User');
var myId = "";
var loggedInUser = "";


module.exports = (app) =>{

// get login folder
app.get("/login", function (req, res) {
    console.log("This is the login page!");
    res.render('login', {layout: false})
    // res.send("Form Submitted")
})

// post login folder
app.post("/login", function (req, res) {

    // To sign a token, you will need to have 3 pieces of information:

    // The token secret
    // The piece of data to hash in the token
    // The token expire time
    // The token secret is a long random string used to encrypt and decrypt the data.

    // To generate this secret, one option is to use Node.js’s built-in crypto library, like so:

    console.log("L33 - This is the login page post route!");
    // res.render('login')
    // res.send(req.body);
    console.log("L36 - This is data entered from the form:  ", req.body);

    // get the user and hashed-password from the database
    let usernameInForm = req.body.username;
    // Load hash from your password DB.
    const myUser = User.findOne({username: usernameInForm})
    console.log("L42 - This is myUser username (from MongoDB): ", myUser) // sidney
    console.log("L43 - This is myUser password  (from MongoDB): ", myUser.password) // some hashed password other than cat that's in the database

        

    // compare the hashed-password entered in the form with the hashed-password in User database
    let areYouAUser = bcrypt.compare(req.body.password, myUser.password, function(err, isMatch) {
        if(isMatch){
            // console.log("The entered user is the same as the database: ", isMatch) // res === true
            // loggedInUser = myUser.username
            // console.log(loggedInUser + " is the logged in user");
            var payload = {_id: myUser._id , username: myUser.username};
            var options = {expiresIn: '1d'};
            const secret = "SuperSecret";
            var token = jwt.sign(payload, secret, options);
            myToken = res.cookie('jwtCookie', token) // jwtCookie = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTI0YjMyOGY0NTgzZTE5ZGNlMjBmZWQiLCJ1c2VybmFtZSI6ImthdGhlcmluZSIsImlhdCI6MTYyOTk0ODQwNSwiZXhwIjoxNjMwMDM0ODA1fQ.TXJE_QWvjYmSHb-Fgrd_LT4mucoPAE4X1ErRnA1bB94
            // set global variable loggedUser = myUser.username that was acquired.
            loggedInUser = myUser.username;        
            console.log("Logged in user is : ", loggedInUser);
            res.redirect('/home');
        } else {
            console.log("The credentials are not in the database, thus not an authorized user: ", isMatch) // res === true
            res.render('login', {layout: false})
        }
        
    });
})

app.get('/', (req, res) => {
    res.render('index', {layout: false}); 
})

// get create folder
app.get('/create', function (req, res) {
    if(loggedInUser===""){
         res.render('create', {layout: false})
    } else {
         console.log("Permission denied!")
         res.render('login', {layout: false})
    }
})
// post create folder
app.post("/create", function(req, res){
    // console.log(req.body);
    var current_date = new Date()

   if(loggedInUser===""){
        const newCourse = new Course({
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            isPublic: req.body.isPublic, // set to "true" when clicked.
            dateCreated: current_date
        });
        console.log("You isPublic entry checkbox is : " + req.body.isPublic);
        newCourse.save(function (err, newCourse) {
            if (err) return console.error(err);
            "New course is entered"
          });
          res.render('create',  {layout: false});

    } else {
        console.log("Permission denied!")
        res.render('login', {layout: false})
    }
});

app.get('/delete:myId', function(req, res){
    if(loggedInUser===""){
        console.log("Line 74 /delete:id - The req.params.id value is: " + req.params.id) // prints : + the id.
        var myId = req.params.id; 
        Course.findByIdAndDelete(myId, function (err) {
            if (err) return console.log(err);
            console.log("Course deleted successful");
        });

        res.render("/home", {layout: false});
    } else {
        console.log("Permission denied!")
        res.render('login', {layout: false})
    }
})

app.get('/details/:id', function (req, res) {
    if(loggedInUser===""){
        console.log("The req.params.id value is: " + req.params.id) // prints : + the id.
        myId = req.params.id; 
        myId = myId.substring(1); // removes the colon from req.params.id
        console.log(myId);
        Course.findById(myId,function (err, id) {
            // if (err) return console.error(err);
                console.log("The id value is: " + id);
                res.render('details', { oneCourse: id, layout: false });
        }).lean();
    
    } else {
        console.log("Permission denied!")
        res.render('login')
    }
})

app.get('/edit/:id', function (req, res) {
    if(loggedInUser===""){
        
        console.log("The req.params.id value is: " + req.params.id) // prints : + the id.
        var myId = req.params.id; 
        myId = myId.substring(1); // removes the colon from req.params.id
        console.log("Line 108: Value of myId in getEdit is: ", myId);
        Course.findById(myId,function (err, id) {
            // if (err) return console.error(err);
                console.log("Line 111 in get edit - The id value is: " + id);
                res.render('edit', { oneCourse: id, layout: false });
        }).lean()//.exec(function(err, body) {
        //     console.log(err)
        //     console.log(body)
        // });
        
        //     await Accessory.find({}, function (err, id) {
        //         // if (err) return console.error(err);
        //             console.log(Accessory);
        //             // res.render('details', { oneCube: id });
        //     }).lean().exec(function(err, body) {
        //         console.log(err)
        //         console.log(body)
        //     });
    } else {
        console.log("Permission denied!")
        res.render('login')
    }
})

app.post('/details/:myId', function (req, res) {
    if(loggedInUser===""){
        let {id, title, description, imageUrl, isPublic} = req.body
        console.log("line 134 - req.body is: ", req.body)
        console.log("Line 135: myId value is:  ", myId);
        myId = id
        const filter = {_id : myId};
        
        // myId = req.body.params;
        var current_date = new Date()
        var isPublicCorrected
        console.log("Line 142: isPublic is :", isPublic);
        // check if req.body.isPublic is set to on or off then change it to true or false
        if(req.body.isPublic == "on"){ isPublicCorrected = true}
        if(req.body.isPublic == "off"){ isPublicCorrected = false}
    // if(loggedInUser !== ''){
            
        console.log("Line 148: Your isPublic entry checkbox is converted from " + isPublic + " to " + isPublicCorrected);
        
        console.log("Line 150: The value of myId is: ", myId);
        // A.findOneAndUpdate(conditions, update, options, callback) // executes

                    // const Character = mongoose.model('Character', new mongoose.Schema({
                    //     name: String,
                    //     age: Number
                    // }));
                    
                    // await Character.create({ name: 'Jean-Luc Picard' });
                    
                    // const filter = { name: 'Jean-Luc Picard' };
                    // const update = { age: 59 };
                    
                    // // `doc` is the document _before_ `update` was applied
                    // let doc = await Character.findOneAndUpdate(filter, update);
                    // doc.name; // 'Jean-Luc Picard'
                    // doc.age; // undefined
                    
                    // doc = await Character.findOne(filter);
                    // doc.age; // 59
        var updatedCourse = {
            title: title,
            description: description,
            imageUrl: imageUrl,
            isPublic: isPublicCorrected, // set to "true" when clicked.
            dateCreated: current_date
        }
        Course.findByIdAndUpdate(
            filter, 
            updatedCourse,
            function(err, data) {
                if(err) return console.log(err);
                console.log("Course update successful. ", data);
            }
        );
        //update.findOneAndUpdate(filter, update).lean()
        // if (err) return console.error(err);
        console.log("Line 183: The id value is: " + myId);

        // go to /home and show all courses.

        const myCourse = Course.find(function(err, coursesFound) {
            // if (err) return console.error(err);
                console.log(coursesFound);
                res.render('home', {courses: coursesFound, layout: false} )
        }).lean()
    } else {
        console.log("Permission denied!")
        res.render('login')
    }
});

app.get('/home', (req, res, next) => {
    if (loggedInUser===""){
        // console.log('loggedInUser is :', loggedInUser);
        //  const myCourse = await User.findOne({username: loggedInUser})
        const myCourse = Course.find(function(err, coursesFound) {
            // if (err) return console.error(err);
                console.log(coursesFound);
                res.render('home', {courses: coursesFound, layout: false} )
         }).lean()//.exec(function(err, body) {            // coursesFound - parameter used in find
        //     console.log(err)
        //     console.log(body)
        // });
    } else {
        console.log("Permission denied!")
        res.render('login', {layout: false})
    }
    });

    app.get("/register", function (req, res) {
        console.log("This is the register page!");
        res.render('register', {layout: false})
        // res.send("Form Submitted")
    })
    // post /register folder
    app.post("/register", function(req, res) {
        console.log("This is req.body!!!  " + req.body);
        const salt = 9;
        if(req.body.password === req.body.repeatPassword){
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                // store has stuff in your password in Users collection
                const newUser = new User({
                    username: req.body.username,
                    // email: req.body.email,  - removed since it isn't required
                    password: hash
                });

                newUser.save(function (err, newUser) {
                    if (err) return console.error(err);
                    "New user is entered"
                });
                res.render('login', {layout: false});
            })
        }     
    });

    /////logout get
    app.get("/logout", function (req, res) {
        console.log("This is the logout page!");
        console.log(loggedInUser + " is logged out!")
        
        res.render('logout', {layout: false})
        // res.send("Form Submitted")
    })
    /////logout post
    app.post("/logout", function (req, res) {
        console.log(loggedInUser + " is logged out!")
        let h1UsernameLoggedOut = document.getElementsByTagName('h1');
        h1UsernameLoggedOut.innnerHTML = "<h1>" + loggedInUser + " is logged out.";
        loggedInUser = "";
        res.redirect('/', {layout: false})
        // res.send("Form Submitted")
    })
    
    // Nothing goes below this line.
    app.get('/*', function (req, res) {
        res.render('404', {layout: false});
    })
}
