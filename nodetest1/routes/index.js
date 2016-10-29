/*

IUKnow-Project(Jade-CSS-Bootstrap-Express-MongoDb)
@author: Rebecca Sam

*/


var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var uri = '';


router.get('/', function(req, res) {
        if(req.session && req.session.username)
        {   
            res.render('home',{
                body:{},
                section:"home",
                userId: req.session.username,
                logout: 'Logout'
            });
        }
    else
        {
        res.render('home',{
                body:{},
                section:"home",
                userId: 'guest'

            });
        }
        
});


/* Login to View/Add Comments */
function requireLogin (req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("login");
  }
};

function requireCheck (req, res, next) {
 req.checkBody("email","Enter a valid email address").isEmail();
 var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    next();
  }
};
  
/* GET Home Page */
router.get('/home', function(req, res) {

   if(req.session && req.session.username)
        {   
            res.render('home',{
                body:{},
                section:"home",
                userId: req.session.username,
                logout: 'Logout'
            });
        }
    else
        {
        res.render('home',{
                body:{},
                section:"home",
                userId: 'guest'

            });
        }
        
});

/* GET Threads Page */
router.get('/threads', function(req, res) {
    res.render('threads',{
        });
});


/* GET Login Page */
router.get('/login', function(req, res) {
    if(req.session.username== "admin"){
        console.log("user:"+req.session.username);
        res.redirect("admin");
        }
    else if(req.session && req.session.username)
    {
        res.render("home",{
                body:{},
                section:"home",
                userId: req.session.username,
                logout: 'Logout'
            });
        }
        else
        {
    res.render('login',{
        });
        }
});

/* GET Blog Page */
router.get('/info', function(req, res) {
    mongodb.MongoClient.connect(uri, function(err, db) {
  
    var cursor = db.collection('events').find({},{});
    //console.log(cursor);
    cursor.toArray(function(err,documents){
        res.render('info', {
            //window.alert("going");
           "eventname" : documents
            });
            db.close();
        });
    });
});

/*GET Already page*/
router.get('/already',function(req, res) {
    res.render('already',{
        });
});

/* GET SignUp Page */
router.get('/signup',function(req, res) {
    if(req.session && req.session.username)
    { res.redirect("already");}
    else
    {
    res.render('signup',{
        });
        }
});

/* GET SignUp-thanks Page */
router.get('/thanks', function(req, res) {
    res.render('thanks',{
        });
});

/* GET Gallery Page */
router.get('/gallery', function(req, res) {
    res.render('gallery',{
        });
});
router.get('/test', function(req, res) {
    res.render('test',{
        });
});

/* GET Admin Page */
router.get('/admin', function(req, res) {
        mongodb.MongoClient.connect(uri, function(err, db) {
  
        var cursor = db.collection('userlist').find({},{});
        cursor.toArray(function(err, currentUsers) {
        res.render('admin', {
        "userlist": currentUsers,
        logout: 'Logout'
                });
                db.close();
        });
        
    });
});

/* GET Contact-Us Page */
router.get('/contact', function(req, res) {
    res.render('contact',{
        });
});


/* GET Admin-Upcoming Events Page */
router.get('/adminn', function(req, res) {

mongodb.MongoClient.connect(uri, function(err, db) {
  
        var cursor = db.collection('events').find({},{});
        cursor.toArray(function(err, docs) {
        res.render('adminn', {
        "event": docs,
        logout: 'Logout'
                });
                db.close();
        });
        
    });
});


router.post('/logout', function(req, res) {
    console.log("go");
    req.session.reset();
    res.redirect("home");
});


/* GET Forum-FAQ Page*/
router.get('/forum-faq',function(req, res) {
      req.session.currentUrl="forum-faq";
    if(req.session && req.session.username)
    {
   mongodb.MongoClient.connect(uri, function(err, db) {
  
  //console.log("going");
    var cursor = db.collection('forum-faq').find({},{});
    //console.log(cursor);
    cursor.toArray(function(err,documents){
        //console.log(documents);
        res.render('forum-faq', {
            //window.alert("going");
           "topics" : documents
           
            });db.close();
            
        });
    });
}
else
{
    res.redirect("login");
    }
});


/* GET Forum-House Page*/
router.get('/forum-house', function(req, res) {
    req.session.currentUrl="forum-house";
   mongodb.MongoClient.connect(uri, function(err, db) {
   
  //console.log("going");
    var cursor = db.collection('forum-house').find({},{});
    //console.log(cursor);
    cursor.toArray(function(err,documents){
        //console.log(documents);
        res.render('forum-house', {
            //window.alert("going");
           "topics" : documents
           
            });
            db.close();
        });
    });

});

/* GET Forum-Class Page*/
router.get('/forum-class', function(req, res) {
    req.session.currentUrl="forum-class";
   mongodb.MongoClient.connect(uri, function(err, db) {
  
  //console.log("going");
    var cursor = db.collection('forum-class').find({},{});
    //console.log(cursor);
    cursor.toArray(function(err,documents){
//        console.log(documents);
        res.render('forum-class', {
            //window.alert("going");
           "topics" : documents
          
            }); 
            db.close();
        });
    });

});



/* POST Sign Up page*/      
router.post('/adduser',requireCheck, function(req, res) {
    var userName = req.body.user_name;
    var userEmail = req.body.email;
    var userPwd = req.body.password;
    req.session.username=userName;
    //console.log(req.session.username);
    req.session.password=userPwd;

    
  mongodb.MongoClient.connect(uri, function(err, db) {
  var document = {
        "username" : userName,
        "email" : userEmail,
        "pwd" : userPwd 
        };
        db.collection('userlist').insert(document, function(err, doc){
              if (err) {
                console.log('Signup error');
                return done(err);
                    }
              else {
                res.redirect("home");}
                db.close();
                    });
        
    }); 
});
    


/* POST Thread page*/      
router.post('/postthread', function(req, res) {
    
  mongodb.MongoClient.connect(uri, function(err, db) {
      
  var userName = req.session.username;
  var thread = req.body.thread;
  //console.log(thread);
  var currentUrl = req.session.currentUrl;
 //console.log(currentUrl);
   db.collection(currentUrl).find().count( function(err, count){ // do stuff here
       var c=count;
       
    // console.log(c+1);
      
  var document = {

    
        "username" : userName,
        "thread_id": c+1,
        "thread_name" : thread,
        
        };
        db.collection(currentUrl).insert(document, function(err, doc){
              if (err) {
                console.log('Signup error');
                return done(err);
                    }
              else {
                res.redirect(currentUrl);}
                db.close();
                    });
          } );
        
    }); 
});    



/* POST Comment page*/      
router.post('/postcomment', function(req, res) {
 var currentUrl = req.session.currentUrl;    
  mongodb.MongoClient.connect(uri, function(err, db) {
      
    var userName = req.session.username;
    var comment = req.body.comment;
    var thread = req.session.thread;
//    console.log(thread);
  var new_comment = {
        "username" : userName,
        "comment" : comment
        };
         var cursor=db.collection(currentUrl).find({"thread_id":thread});

        cursor.toArray(function(err,doc)
        {
        var comments=doc[0].comments;
//        console.log(comments);
        comments.push(new_comment);
        db.collection(currentUrl).update({"thread_id":thread},{$set:{"comments":comments}},function(err,doc){});
//         console.log(comments);
            res.render("comments", {

           "bank" : comments


            });

                db.close();
                    });
               });
    });



/* GET thread comments Page*/
router.get('/view', function(req, res) {
    var username=req.session.username;
    var currentUrl=req.session.currentUrl;
    console.log(currentUrl);
    var thread=req.query.thread;
    var th=parseInt(thread);
    req.session.thread=th;
//    console.log(typeof(th));
//    console.log(thread);
    mongodb.MongoClient.connect(uri, function(err, db) {
    var cursor = db.collection(currentUrl).find({"thread_id":th},{});
//    console.log(cursor);
    cursor.toArray(function(err,documents){
//    console.log(documents[0].comments);
        res.render('comments', {
            //window.alert("going");
           "bank" : documents[0].comments

            //process.stdout.write(docs);
            }); db.close();
            });
        });
});





    
/* POST Login Page */
router.post('/auth', function(req, res) {
    
    mongodb.MongoClient.connect(uri, function(err, db) {
    var username = req.body.username;
    var password = req.body.password;
    if(username=="admin" && password== "admin")
    {
        req.session.username = "admin";
         res.redirect("admin");
        }
        else
        {
    db.collection('userlist').findOne({'username': username},function(err, doc){
        if(err) {
            console.log('Signin error');
             res.send(err);
        }
       if(doc){
        req.session.username = doc.username;
        res.redirect("home");
            }
        else
        {
            res.redirect("signup");
            }
        db.close();
        });
    }
});
});



/* POST Delete User page*/      
router.post('/delete', function(req, res) {
    //console.log(req);
    var userName = req.body.username;
    //console.log(userName);
    mongodb.MongoClient.connect(uri, function(err, db) {
  
     db.collection('userlist').findOne({'username': userName},function(err, doc){
        if(err) {
            console.log('Deletion error');
             res.send(err);
       }
        db.collection('userlist').remove(doc,function(err, result){
        console.log(result);    
        res.redirect("admin");
        db.close();
            });
        });
    });
});

/* POST Delete event page*/      
router.post('/deleteevent', function(req, res) {
    var eventName = req.body.eventname;
 
    mongodb.MongoClient.connect(uri, function(err, db) {
     db.collection('events').findOne({'eventname': eventName},function(err, doc){
        if(err) {
            console.log('Deletion error');
             res.send(err);
       }
        db.collection('events').remove(doc,function(err, result){    
        res.redirect("adminn");
        db.close();
            });
        });
    });
});

/* POST Add Event page*/      
router.post('/addevent', function(req, res) {
    var eventName = req.body.event;
    console.log(eventName);
 
    var document = {
        "eventname" : eventName,
        };  
  mongodb.MongoClient.connect(uri, function(err, db) {
        db.collection('events').insert(document, function(err, doc){
              if (err) {
                console.log('Events error');
                return done(err);
                    }
              else {
                res.redirect("adminn");}
                     db.close();});
       
    }); 
});
    

module.exports = router;