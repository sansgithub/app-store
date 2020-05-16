const App = require('../models/app.model');

exports.create = (req, res) => {
    if(!req.body.name || !req.body.developer || !req.body.email) {
        return res.status(400).send({
            message: "Field cannot be empty"
        });
    }
    const app = new App({
        name: req.body.name, 
        developer: req.body.developer,
        email: req.body.email
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