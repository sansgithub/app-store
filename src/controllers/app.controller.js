const App = require('../models/app.model');
var express = require('express');

//user/admin can create app
exports.create = (req, res) => {
    console.log('running');
    if(!(req.body.name || req.body.developer || req.file)) {
        return res.status(400).send({
            message: "Field cannot be empty"
        });
    }
       
    const app = new App({
        name: req.body.name, 
        developer: req.body.developer,
        email: req.user.email,
        createdBy: req.user.id,
        icon: req.files["icon"][0].path,
        screenshots : req.files["screenshots"].map(m=>m.path),
    });
    app.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};

//admin can view approved apps
exports.show = (req, res) => {
    App.find({}, function (err, result) {
        if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
    });
};

//user/admin can edit his own app
exports.edit = (req, res) => {
    App.findById(req.params.app_id, function (err, current_app) {
        if(err){
            return next(err);
        }else{
            if(req.user.id == current_app.createdBy || req.user.id == "5ece339ba935d9109cf9f4c8")  {
                current_app.updateOne({ $set: req.body }, (err) => {
                    if (err) {
                        return next(err);
                    }
                    res.send('Edit successfull!');
                });
            } else{
                res.send("current user cannot edit");
            }  
        }
    });
};

//user/admin can delete his own app
exports.delete = (req, res) => {       
    App.findById(req.params.app_id, function (err, current_app) {
        if(err){
            return next(err);
        }else{
            if(req.user.id == current_app.createdBy || req.user.id == "5ece339ba935d9109cf9f4c8")  {
                current_app.deleteOne((err) => {
                    if (err) {
                        return next(err);
                    }
                    res.send('Deleted successfully!');
                });
            } else{
                res.send("current user cannot delete");
            }  
        }
    });
    
    
}

//user can view his own app
exports.showMyApps = (req, res) => {
    App.find({createdBy: req.params.user_id} ,null, function(err, result){
        if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
    });
}

//admin can search app
exports.searchApp = (req, res) => {
    App.find({name:{ $regex: req.params.app_name, $options: 'i' }}, function(err, result){
        if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
    });


}