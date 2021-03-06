var express = require('express');
var app = express();
var path = __dirname;
var mongoose = require('mongoose'); 
var uri = 'mongodb://jonathan:brokensword=99@ds019980.mlab.com:19980/heroku_c13sjx0h';
var bodyParser = require('body-parser');

mongoose.connect(uri);  

app.use(express.static(path));

app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

	var apiCall = mongoose.model('apiCall', {
	  image : String,
	  title : String,
	  ingredients :  Array,
	  instructions : String,
	  totalTime : String,
	  directions: Array,
	  servings: Number,
	  course: String,
	  cuisine: String,
	  deletedFlag: Boolean
	});

app.get('/', function(req, res) {
	res.sendFile(path + '/index.html');
});

app.get('/api/recipes', function(req, res) {

	var filterObject = {};

	if(req.query.cuisine != 'undefined' && req.query.cuisine) {
		filterObject.cuisine = req.query.cuisine;
	}
	if(req.query.course != 'undefined' && req.query.course) {
		filterObject.course = req.query.course;
	}
	filterObject.deletedFlag = true;
	apiCall.find(filterObject, function(err, recipe) {
		if(err) {
			res.send(err)
		}
		res.json(recipe);
	})

});

app.post('/api/recipes', function(req, res) {
	apiCall.create({
		image: req.body.image,
		title: req.body.title,
		ingredients: req.body.ingredients,
		instructions: req.body.instructions,
		totalTime: req.body.totalTime,
		directions: req.body.directions,
		servings: req.body.servings,
		course: req.body.course,
		cuisine: req.body.cuisine,
		deletedFlag: true,
		done : true
	}, function(err, recipe) {
		if(err){
			res.send(err)
		}
		apiCall.find(function(err, recipe) {
			if(err){
				res.send(err)
			}
			res.json(recipe);
		})
	})
});

app.delete('/api/recipes/:recipe_id', function(req, res) {
	apiCall.findById(req.params.recipe_id ,function(err, recipe) {
		if(err) {
			res.send(err)
		}

		recipe.deletedFlag = false

		recipe.save(function(err) {
			if(err) {
				res.send(err)
			}
			var filterObject = {};

			filterObject.deletedFlag = true;
	
			apiCall.find(filterObject, function(err, recipe) {
				if(err) {
					res.send(err)
				}
				res.json(recipe);
			})
		})	
	})
});

app.get('/api/recipes/:recipe_id', function(req, res) {
	apiCall.findById(req.params.recipe_id ,function(err, recipe) {
		if(err){
			res.send(err)
		}

		res.json(recipe);
	})
});

app.put('/api/recipes/:recipe_id', function(req, res) {
	apiCall.findById(req.params.recipe_id ,function(err, recipe) {
		if(err){
			res.send(err)
		}

		recipe.image = req.body.image,
		recipe.title = req.body.title,
		recipe.ingredients = req.body.ingredients,
		recipe.instructions = req.body.instructions,
		recipe.totalTime = req.body.totalTime,
		recipe.directions = req.body.directions,
		recipe.servings = req.body.servings,
		recipe.course = req.body.course,
		recipe.cuisine = req.body.cuisine,
		recipe.deletedFlag = true

		recipe.save(function(err) {
			if(err){
				res.send(err)
			}
			res.json(recipe);
		})	
		
	})
});

console.log("Listening on Port: ", (process.env.PORT || 3000));
app.listen(process.env.PORT || 3000);
