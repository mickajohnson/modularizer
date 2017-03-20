if (process.argv.length < 4){
  console.log("Usage: node modularizer.js project_name model_name");
  return;
}
var fs = require("fs")
var path = require("path")

function title(str){
  var newstr = "";
  newstr += str[0].toUpperCase();
  for (var i = 1; i < str.length; i++){
    newstr += str[i];
  }
  return newstr;
}

var projectName = process.argv[2].toLowerCase();
var model = process.argv[3].toLowerCase();
var modelTitle = title(model)


var server =
`var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
var root = __dirname;

app.use(express.static(path.join(root, "client")));
app.use(express.static(path.join(root, "bower_components")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("./server/config/mongoose.js");
require("./server/config/routes.js")(app);
app.listen(2401, function(){console.log("listening on port 2401");
})`;
var routes =
`var ${model} = require("../controllers/${model}s.js")
module.exports = function(app){
  // app.get('/', ${model}.index)
}`;
var mongoose =
`var mongoose = require("mongoose");
var fs = require("fs");
var path = require("path");
mongoose.connect("mongodb://localhost/${projectName}");
var models_path = path.join(__dirname, "./../models");
fs.readdirSync(models_path).forEach(function(file) {
  if(file.indexOf(".js") >= 0) {
    require(models_path + "/" + file);
  }
});`;
var index =
`<!DOCTYPE html>
<html ng-app="app">
  <head>
    <meta charset="utf-8">
    <title>Welcome</title>
    <script src="angular/angular.js" charset="utf-8"></script>
    <script src="angular-route/angular-route.js" charset="utf-8"></script>
    <script src="angular-cookies/angular-cookies.js" charset="utf-8"></script>
    <script src="assets/config.js" charset="utf-8"></script>
    <script src="assets/factories/${model}Factory.js" charset="utf-8"></script>
    <script src="assets/controllers/${model}Controller.js" charset="utf-8"></script>
    <script src="https://code.jquery.com/jquery-3.1.1.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  </head>
  <body>
    <div ng-view=""></div>
  </body>
</html>`;
var config =
`var app = angular.module("app", ["ngRoute", "ngCookies"]);
app.config(function ($routeProvider) {
  $routeProvider
})`;
var clientController =
`app.controller("${model}Controller", ["$scope", "${model}Factory", "$location", "$cookies", function($scope, ${model}Factory, $location, $cookies){
}])
`;
var factory =
`app.factory('${model}Factory', ["$http", function($http){
  var factory = {};
  return factory;
}])`;
var model =
`var mongoose = require('mongoose')

var ${model}Schema = mongoose.Schema({

},{timestamps: true})

mongoose.model('${modelTitle}', ${model}Schema);
`;
var serverController =
`var mongoose = require('mongoose');
var ${modelTitle} = mongoose.model('${modelTitle}')
module.exports = {
//  index = function(req, res){}
}`;
var bower =
`{
  "name": "y",
  "description": "y",
  "main": "y",
  "authors": [
    "y"
  ],
  "license": "y",
  "keywords": [
    "y"
  ],
  "homepage": "y",
  "private": true,
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests"
  ],
  "dependencies": {
    "angular": "^1.6.2",
    "angular-route": "^1.6.2",
    "angular-cookies": "^1.6.2"
  }
}`;
var npm =
`{
  "name": "${projectName}",
  "version": "1.0.0",
  "description": "",
  "main": "modularizer.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1",
    "start": "node server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.16.1",
    "express": "^4.14.1",
    "mongoose": "^4.8.3"
  }
}`

var root = path.join(__dirname, projectName)
fs.mkdir(root, function(err, folder){
  fs.mkdir(path.join(root, "client"), function(err, folder){
    if (err){
      console.log(err);
    }
    else{
      fs.mkdir(path.join(root, "client", "assets"), function(err, folder){
          if(err){
            console.log(err);
          }
          else{
            fs.mkdir(path.join(root, "client", "assets", "controllers"), function(err, folder){
                if(err){
                  console.log(err);
                }
                else{
                  var controller = model + "Controller.js"
                  fs.writeFile(path.join(root, "client", "assets", "controllers", controller), clientController, "utf8", function(err){
                    if (err){
                      console.log(err);
                    }
                  });
                }
            });
            fs.mkdir(path.join(root, "client", "assets", "factories"), function(err, folder){
                if(err){
                  console.log(err);
                }
                else{
                  var factory = model + "Factory.js"
                  fs.writeFile(path.join(root, "client","assets", "factories", factory), factory, "utf8", function(err){
                    if (err){
                      console.log(err);
                    }
                  });
                }
            });
            fs.writeFile(path.join(root, "client","assets", "config.js"), config, "utf8", function(err){
              if (err){
                console.log(err);
              }
            });
          }
      });
      fs.mkdir(path.join(root, "client", "partials"), function(err, folder){
          if(err){
            console.log(err);
          }
      });
      fs.writeFile(path.join(root, "client", "index.html"), index, "utf8", function(err){
        if (err){
          console.log(err);
        }
      });
    }
  });
  fs.mkdir(path.join(root, "server"), function(err, folder){
    if (err){
      console.log(err);
    }
    else{
      fs.mkdir(path.join(root, "server", "config"), function(err, folder){
          if(err){
            console.log(err);
          }
          else{
            fs.writeFile(path.join(root, "server", "config", "routes.js"), routes, "utf8", function(err){
              if (err){
                console.log(err);
              }
            });
            fs.writeFile(path.join(root, "server", "config", "mongoose.js"), mongoose, "utf8", function(err){
              if (err){
                console.log(err);
              }
            });
          }
      });
      fs.mkdir(path.join(root, "server", "controllers"), function(err, folder){
          if(err){
            console.log(err);
          }
          else{
            var newController = model + "s.js"
            fs.writeFile(path.join(root, "server", "controllers", newController), serverController, "utf8", function(err){
              if (err){
                console.log(err);
              }
            });
          }
      });
      fs.mkdir(path.join(root, "server", "models"), function(err, folder){
          if(err){
            console.log(err);
          }
          else{
            var newModel = model + ".js"
            fs.writeFile(path.join(root, "server", "models", newModel), model, "utf8", function(err){
              if (err){
                console.log(err);
              }
            });
          }
      });
    }
  });
  fs.writeFile(path.join(root, "server.js"), server, "utf8", function(err){
    if (err){
      console.log(err);
    }
  });
  fs.writeFile(path.join(root, "package.json"), npm, "utf8", function(err){
    if (err){
      console.log(err);
    }
  });
  fs.writeFile(path.join(root, "bower.json"), bower, "utf8", function(err){
    if (err){
      console.log(err);
    }
  });
})
