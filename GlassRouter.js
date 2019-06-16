
const express = require('express');
const GlassRouter = express.Router();

const Glass = require('./Glass');

GlassRouter.route('/create').post(function (req, res) {
  console.log('glassrouter: ', JSON.stringify(req.body)); 
    const glass = new Glass(req.body);
    glass.save()
      .then(glass => {
        res.json(`Glass ${JSON.stringify(req.body)} added successfully`);
      })
      .catch(err => {
        res.status(400).send("unable to save to database");
      });
  });
  
  module.exports = GlassRouter;