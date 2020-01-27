/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Chris Pinkney   Student ID: 044477149   Date: 27-Nov-19
*
* Online (Heroku) Link: https://serene-beyond-12657.herokuapp.com/ 
*
********************************************************************************/
const clientSessions = require ("client-sessions");
const dataServiceAuth = require("./data-service-auth.js");
const express = require("express"); //Part 1 Step 4 Update server.js & testing the app
const app = express(); //Part 1 Step 4 Update server.js & testing the app
const dataService = require("./data-service.js"); //Part 2 Step 2 Updating the custom data-service.js module
const path = require("path"); //Part 1 Step 2 Adding new routes in server.js to support the new views
const multer = require("multer"); // Assignment 3 - Part 2 Step 1 Adding multer
const bodyParser = require("body-parser"); // Assignment 3 - Part 3 Step 1 Adding body-parser
const fs = require("fs"); // Assignment 3 - Part 2 Step 3: Adding "Get" route / using the "fs" module
const exphbs = require("express-handlebars"); 
const HTTP_PORT = process.env.PORT || 8080; //Part 1 Step 4 Update server.js & testing the app

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true })); //Part 3 Step 1 Adding body-parser

app.use(clientSessions({
	cookieName: "session", // this is the object name that will be added to 'req'
	secret: "week10example_web322", // this should be a long un-guessable string.
	duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
	activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
  }));

//Once this is complete, incorporate the following custom middleware function to ensure that all of your templates will have access to a "session" object
app.use(function(req, res, next) {
	res.locals.session = req.session;
	next();
});

//Define a helper middleware function (ie: ensureLogin from the Week 10 notes) that checks if a user is logged in
function ensureLogin(req, res, next) {
	if (!req.session.user) {
	  res.redirect("/login");
	} else {
	  next();
	}
}

// Assignment 4 Part 1 Step 4
// Our server needs to know how to handle HTML files that are formatted using handlebars
// app.engine and app.set register handlebars as the rendering engine for views
// Adds custom helpers for changing navbar page to active, and one more for evaluate conditions for equality
app.engine('.hbs',exphbs({
    extname:'.hbs', 
    defaultLayout:'main',
    helpers: {
        navLink: function(url, options) {
			return '<li' + ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href="' + url + '">' + options.fn(this) + '</a></li>';
		},
        equal: function(lvalue, rvalue, options) {
            if(arguments.length < 3)
                throw new Error("Handlerbars Helper equal needs 2 parameters");
            if(lvalue != rvalue){
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

app.set('view engine','.hbs'); //This will tell our server that any file with the “.hbs” extension (instead of “.html”) will use the handlebars “engine” (template engine).

// Assignment 3 - Part 2 Step 1 Adding multer
const storage = multer.diskStorage({
	destination: "./public/images/uploaded",
	filename: function(req, file, cb) {
		// we write the filename as the current date down to the millisecond
		// in a large web service this would possibly cause a problem if two people
		// uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
		// this is a simple example.
		cb(null, Date.now() + path.extname(file.originalname));
	}
});

// Assignment 3 - Part 2 Step 1 Adding multer
// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });


//Assignment 4 - Part 1 Step 4
app.use(function(req,res,next){
	let route = req.baseUrl + req.path;
	app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
	next();
});


//----------------------------------------------------------------//


//Part 1 Step 4 Update server.js & testing the app
//Updated in Assignment 4 Part 4 Step 3:
app.get("/", function(req,res) {
	res.render("home");
});


//Part 1 Step 4 Update server.js & testing the app
app.get("/about", function(req,res) {
	res.render("about");
});


// Assignment 2 - Part 2 Step 3 Adding additional Routes
// Updated in Assignment 3 - Step 4.1 Update the "/employees" route
// Updated in Assignment 4 Part 3 Step 1
// Updated in Assignment 5 Updating the Navbar & Existing views (.hbs)
app.get("/employees", ensureLogin, function(req,res) {
	if (req.query.status) {
		dataService.getEmployeesByStatus(req.query.status)
		.then(function(data) {
			if (data.length > 0)
				res.render("employees", {
					employees: data
				});
			else
				res.render("employees", {
					message: "no results"
				});
		})
		.catch(function(err) {
			res.render("employees", {
				message: err
			});
		})
	}
	else if (req.query.department) {
		dataService.getEmployeesByDepartment(req.query.department)
		.then(function(data) {
			if (data.length > 0)
				res.render("employees", {
					employees: data
				});
			else
				res.render("employees", {
					message: "no results"
				});
		})
		.catch(function(err) {
			res.render("employees", {
				message: err
			});
		})
	}
	else if (req.query.manager) {
		dataService.getEmployeesByManager(req.query.manager)
		.then(function(data) {
			if (data.length > 0)
				res.render("employees", {
					employees: data
				});
			else
				res.render("employees", {
					message: "no results"
				});
		})
		.catch(function(err) {
			res.render("employees", {
				message: err
			});
		})
	}
	// else if (req.query.num) {
	// 	dataService.getEmployeeByNum(req.query.num)
	// 	.then(function(data) {
	// 		if (data.length > 0)
	// 			res.render("employees", {
	// 				employees: data
	// 			});
	// 		else
	// 			res.render("employees", {
	// 				message: "no results"
	// 			});
	// 	})
	// 	.catch(function(err) {
	// 		res.render("employees", {
	// 			message: err
	// 		});
	// 	})
	// }
	else {
		dataService.getAllEmployees()
		.then(function(data) {
			if (data.length > 0)
				res.render("employees", {
					employees: data
				})
			else
				res.render("employees", {
					message: "no results"
				})
		})
		.catch(function(err) { 
			res.render("employees", {
				message: err
			});
		})
	}
});


// Assignment 2 - Part 2 Step 3 Adding additional Routes
// Updated in Assignment 4 Part 4 Step 2
// Updated in Assignment 5 Updating the Navbar & Existing views (.hbs)
app.get("/departments", ensureLogin, function(req,res) {
	dataService.getDepartments()
	.then(function(data) {
		if (data.length > 0)
			res.render("departments", {
				departments: data
			});
		else
			res.render("departments", {
				message: "no results"
			});
	})
	.catch(function(err) { 
		res.render("departments", {
			message: err
		});
	})
});


// Assignment 3 - Part 4 Step 2 Add the "/employee/value" route
// Updated in Part 5 Step 1
app.get("/employee/:empNum", ensureLogin, (req, res) => {
	// initialize an empty object to store the values
	let viewData = {};
	dataService.getEmployeeByNum(req.params.empNum).then((data) => {
		if (data) {
			viewData.employee = data; //store employee data in the "viewData" object as "employee"
		} else {
			viewData.employee = null; // set employee to null if none were returned
		}
	}).catch(() => {
		viewData.employee = null; // set employee to null if there was an error
	}).then(dataService.getDepartments)
	.then((data) => {
	viewData.departments = data; // store department data in the "viewData" object as "departments"
	// loop through viewData.departments and once we have found the departmentId that matches
	// the employee's "department" value, add a "selected" property to the matching
	// viewData.departments object
	for (let i = 0; i < viewData.departments.length; i++) {
		if (viewData.departments[i].departmentId == viewData.employee.department) {
			viewData.departments[i].selected = true;
		}
	}
	}).catch(() => {
		viewData.departments = []; // set departments to empty if there was an error
	}).then(() => {
		if (viewData.employee == null) { // if no employee - return an error
			res.status(404).send("Employee Not Found");
		} else {
			res.render("employee", { viewData: viewData }); // render the "employee" view
		}
	});
});


// Assignment 3 - Part 1 Step 2: Adding new routes in server.js to support the new views
app.get("/employees/add", ensureLogin, function(req,res) {
	dataService.getDepartments()
    .then(function (data) {
		res.render("addEmployee", {
			departments: data
		});
	})
    .catch(function () {
		res.render("addEmployee", {
			departments: []
		});
	})
});


// Assignment 3 - Part 1 Step 2: Adding new routes in server.js to support the new views
app.get("/images/add", ensureLogin, function(req,res) {
	res.render("addImage");
});


// Assignment 3 - Part 2 Step 2: Adding the "Post" route
app.post("/images/add", ensureLogin, upload.single("imageFile"), function(req, res) {
	res.redirect("/images");
});


// Assignment 3 - Part 2 Step 3: Adding "Get" route / using the "fs" module
// Modified in Assignment 4 - Part 2 Step 1
app.get("/images", ensureLogin, function(req,res) {
	fs.readdir("./public/images/uploaded", function(failure, imageFile) {
		res.render("Images", {
			data: imageFile, 
			title: "Images" 
		});
	})
});


// Assignment 3 - Part 3 Step 2: Adding "Post" route
app.post("/employees/add", ensureLogin, function(req, res) {
	dataService.addEmployee(req.body)
	.then(res.redirect("/employees"))
	.catch(res.status(404).send("Page Not Found"));
});


// Assignment 4 - Part 5 Step 1
app.post("/employee/update", ensureLogin, function(req, res) {
    dataService.updateEmployee(req.body)
	.then(res.redirect("/employees"))
	.catch((err)=>{
		res.status(500).send("Unable to Update Employee");
	});
});


// Added in Assignment 5 "Updating Routes (server.js) to Add / Update Departments"
app.get("/departments/add", ensureLogin, function(req, res) {
    res.render("addDepartment");
});


// Added in Assignment 5 "Updating Routes (server.js) to Add / Update Departments"
app.post("/departments/add", ensureLogin, function(req, res) {
    dataService.addDepartment(req.body)
        .then(res.redirect("/departments"))
        .catch(res.status(404).send("Page Not Found"));
})


// Added in Assignment 5 "Updating Routes (server.js) to Add / Update Departments"
app.post("/department/update", ensureLogin, function(req, res){
		dataService.updateDepartment(req.body)
		.then(res.redirect("/departments"))
		.catch(res.status(404).send("Page Not Found"));
});


// Added in Assignment 5 "Updating Routes (server.js) to Add / Update Departments"
app.get("/department/:departmentId", ensureLogin, function(req, res) {
    dataService.getDepartmentById(req.params.departmentId)
    .then(function(data) {
		if (data.length != 0)
			res.render("department", {department: data});
		else
			res.status(404).send("Department Not Found");
	})
	.catch(function() {
		res.status(404).send("Department Not Found");
	})
});


// Added in Assignment 5 "Updating Routes (server.js) to Add / Update Departments"
app.get("/departments/delete/:departmentId", ensureLogin, (function (req, res) {
	dataService.deleteDepartmentById(req.params.departmentId)
	.then(function() {
        res.redirect("/departments");
	})
	.catch(function() {
        res.status(500).send("Unable to Remove Department / Department not found)");
    });
}));


// Added in Assignment 5 Updating server.js, data-service.js & employees.hbs to Delete Employees
app.get("/employees/delete/:empNum", ensureLogin, (function(req, res) {
	dataService.deleteEmployeeByNum(req.params.empNum)
	.then(function(data) {
        res.redirect("/employees");
	})
	.catch(function(err) {
        res.status(500).send("Unable to Remove Employee / Employee not found)");
    });   
}));




app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    dataServiceAuth.registerUser(req.body)
    .then(function(data) {
        res.render("register", {successMessage: "User created"})
	})
	.catch(function(err) {
        res.render("register", {errorMessage: err, userName: req.body.userName})
    });
});

app.post("/login", function(req, res) {
    req.body.userAgent = req.get('User-Agent');

    dataServiceAuth.checkUser(req.body)
    .then((user) => {
        req.session.user = {
            userName: user.userName,
            email: user.email,
            loginHistory: user.loginHistory
        }
        res.redirect('/employees');
    }).catch(function(err) {
        res.render("login", {errorMessage: err, userName: req.body.userName});
    });
});

app.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/");
});

app.get("/userHistory", ensureLogin, function(req, res) {
    res.render("userHistory");
})

// Assignment 2 - Part 2 Step 3 Adding additional Routes
app.use(function(req, res) {
	res.status(404).send("404 STATUS - Page Not Found");
});


// Assignment 2 - Part 2 Step 5 Updating the code surrounding app.listen()
dataService.initialize()
	.then(dataServiceAuth.initialize)
	.then(function(){
		app.listen(HTTP_PORT, function(){
			console.log("app listening on: " + HTTP_PORT)
		});
	}).catch(function(err){
		console.log("unable to start server: " + err);
});