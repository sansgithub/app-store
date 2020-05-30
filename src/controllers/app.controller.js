const App = require('../models/app.model');


exports.create = (req, res) => {
    if(!(req.body.name || req.body.developer || req.file)) {
        return res.status(400).send({
            message: "Field cannot be empty"
        });
    }
    
    let icon_path =  'icons/' + req.file.originalname;
    
    const app = new App({
        name: req.body.name, 
        developer: req.body.developer,
        email: req.user.email,
        createdBy: req.user.id,
        icon: icon_path
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

exports.show = (req, res) => {
    App.find({}, function (err, result) {
        if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
    });
};

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

exports.showMyApps = (req, res) => {
    App.find({createdBy: req.params.user_id} ,null, function(err, result){
        if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
    });
}

exports.searchApp = (req, res) => {
    App.find({name:{ $regex: req.params.app_name, $options: 'i' }}, function(err, result){
        if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
    });


}