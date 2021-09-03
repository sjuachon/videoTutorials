const express = require('express');
const route = express.Router();
const exphbs = require('express-handlebars');
const Course = require('../models/Course');
const User = require('../models/User');
const bcrypt = require('bcrypt');


const cookieParser = require('cookie-parser');

var loggedInUser = "";

module.exports = (app) =>{
    // app.get('/', async (req, res, next) => {
        // console.log(req.cookies.token);
        // console.log('loggedInUser is :', loggedInUser);
        // const myUser = await User.findOne({username: loggedInUser})
        //     await Cube.find(function (err, cubesFound) {
        //     // if (err) return console.error(err);
        //         // console.log(cubesFound);

        //         console.log(req.cookies)
                
        //         res.render('index', { cubes: cubesFound, jwtCookie: req.cookies.jwtCookie }); // cubes - from mongoDb
        //     }).lean().exec(function(err, body) {            // cubesFound - parameter used in find
        //         console.log(err)
        //         console.log(body)
        //     });
   
    // });

    app.get('/', (req, res) => {
        res.render('index', {layout: false}); 
    })
// get create folder
app.get('/create', function (req, res) {
    // if(loggedInUser){
         res.render('create',   {layout: false})
    // } else {
    //      console.log("Permission denied!")
    //      res.render('login')
    // }
})
// post create folder
app.post("/create", function(req, res){
    // console.log(req.body);
    var current_date = new Date()

   // if(loggedInUser !== ''){
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

    // } else {
    //     console.log("Permission denied!")
    //     res.render('login', {layout: false})
    // }

    
});

app.get('/details/:id', function (req, res) {
    // if(loggedInUser !== ""){
        
    console.log("The req.params.id value is: " + req.params.id) // prints : + the id.
    var myId = req.params.id; 
    myId = myId.substring(1); // removes the colon from req.params.id
    console.log(myId);
    Course.findById(myId,function (err, id) {
        // if (err) return console.error(err);
            console.log("The id value is: " + id);
            res.render('details', { oneCourse: id, layout: false });
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
    // } else {
    //     console.log("Permission denied!")
    //     res.render('login')
    // }
})

app.get('/edit/:id', function (req, res) {
    // if(loggedInUser !== ""){
        
    console.log("The req.params.id value is: " + req.params.id) // prints : + the id.
    var myId = req.params.id; 
    myId = myId.substring(1); // removes the colon from req.params.id
    console.log(myId);
    Course.findById(myId,function (err, id) {
        // if (err) return console.error(err);
            console.log("The id value is: " + id);
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
    // } else {
    //     console.log("Permission denied!")
    //     res.render('login')
    // }
})


// get /home
 app.get('/home', (req, res, next) => {
        
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
    // Nothing goes below this line.
    app.get('/*', function (req, res) {
        res.render('404', {layout: false});
    })
}
