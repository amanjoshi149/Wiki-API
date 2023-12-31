const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);


// generic route handlers

// app.get('/articles', function(req, res) {
//     Article.find().then(function(err,foundArticles) {
//         if(!err) {
//             res.send(foundArticles);
//         } else {
//             res.send(err);
//         }
//     });
// });

// app.post('/articles',function (req,res) { 
//         const article = new Article({
//             title : req.body.title,
//             content: req.body.content
//         });
//         article.save().then(function(err){
//             if(!err)
//                 res.send("Successfully added a new article.");
//             else
//                 res.send(err);
//         });
//  });


//  app.delete("/articles",function (req,res) { 
//         Article.deleteMany().then(function(){
//             res.send("Articles deleted");
//         });
//   });



// Chained generic route handlers
app.route("/articles").get(function(req, res) {
    Article.find().then(function(err,foundArticles) {
        if(!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
}).post(function (req,res) {
    const article = new Article({
        title : req.body.title,
        content: req.body.content
    });
    article.save().then(function(err){
        if(!err)
            res.send("Successfully added a new article.");
        else
            res.send(err);
    });
}).delete(function (req,res) {
    Article.deleteMany().then(function(err){
        if(!err)
            res.send("Articles deleted");
        else
            res.send(err);
    });
});


// specific route handlers

app.route("/articles/:myspecificroute").get(function (req,res) {
    Article.findOne({title: req.params.myspecificroute}).then(function(err,foundArticle) {
        if(foundArticle) {
            res.send(foundArticle);
        } else {
            res.send(err);
        }
    });
}).put(function (req,res) {
    Article.updateOne(
        {title: req.params.myspecificroute},
        {title: req.body.title, content: req.body.content}).then(function(err){
        if(!err)
            res.send("successfully updated article.");
        else 
            res.send(err);
    })
}).patch(function (req,res) {  
    Article.updateOne(
        {title: req.params.myspecificroute},
        {$set: req.body}
    ).then(function(err)
    {
        if(!err)
            res.send("successfully updated article.");
        else
            res.send(err);
    });
}).delete(function(req,res){
    Article.deleteOne({title: req.params.myspecificroute}).then(function(err){
        if(!err)
            res.send('Successfully deleted one article');
        else
            res.send(err);
    });
});





app.listen(3000, function() {   
    console.log("Server started on port 3000");
});

