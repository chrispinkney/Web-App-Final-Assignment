const Sequelize = require('sequelize');

var sequelize = new Sequelize('dciqfd50kau5bf', 'urygingjnbhqnr', 'da85555b0e3ac703dcf2ca6de120033b5be387c4b64b84f2843a16cac27032fb', {
	host: 'ec2-107-21-126-201.compute-1.amazonaws.com',
	dialect: 'postgres',
	port: 5432,
	dialectOptions: {
		ssl: true
	}
});

//const?
var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING,
});

//const?
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

Department.hasMany(Employee, {foreignKey: 'department'});


// Assignment 2 - Part 2 Step 4 Writing the data-service.js module
// Updated in Assignment 5 - Update Existing data-service.js functions
module.exports.initialize = function() {
    return new Promise(function (resolve, reject) {
		sequelize.sync()
		.then(function() {
			resolve();
		})
		.catch(function(err) {
			reject("unable to sync the database");
		})
	})
};


// Assignment 2 - Part 2 Step 4 Writing the data-service.js module
// Updated in Assignment 5 - Update Existing data-service.js functions
module.exports.getAllEmployees = function() {
    return new Promise(function (resolve, reject) {
		Employee.findAll()
        .then(function(data) {
			resolve(data);
		})
        .catch(function(err) {
			reject("no results returned");
		})
	})
};


// Assignment 3 - Part 5 Step 1 Add the getEmployeesByStatus(status) Function
// Updated in Assignment 5 - Update Existing data-service.js functions
module.exports.getEmployeesByStatus = function(status) {
    return new Promise(function (resolve, reject) {
		Employee.findAll({
			where: {
				status: status
			}})
        .then(function(data) {
			resolve(data);
		})
        .catch(function(err) {
			reject("no results returned");
		})
	})
};


// Assignment 3 - Part 5 Step 2 Add the getEmployeesByDepartment(department) Function
// Updated in Assignment 5 - Update Existing data-service.js functions
module.exports.getEmployeesByDepartment = function(department) {
    return new Promise(function (resolve, reject) {
		Employee.findAll({
			where: {
				department: department
			}})
        .then(function(data) {
			resolve(data);
		})
        .catch(function(err) {
			reject("no results returned");
		})
	})
};


// Assignment 3 - Part 5 Step 3 Add the getEmployeesByManager(manager) Function
// Updated in Assignment 5 - Update Existing data-service.js functions
module.exports.getEmployeesByManager = function(manager) {
	return new Promise(function (resolve, reject) {
		Employee.findAll({
			where: {
				employeeManagerNum: manager
			}})
		.then(function(data) {
			resolve(data);
		})
		.catch(function(err) {
			reject("no results returned");
		})
	})
};


// Assignment 3 - Part 5 Step 4(3?) Add the getEmployeeByNum(num) Function
// Updated in Assignment 4 Part 5 Step 1, see notes
// Updated in Assignment 5 - Update Existing data-service.js functions
module.exports.getEmployeeByNum = function(empNum) {
    return new Promise(function (resolve, reject) {
		Employee.findAll({
			where: {
				employeeNum: empNum
			}})
		.then(function(data) {
            //resolve(data);
			resolve(data[0]);
		})
		.catch(function(err) {
			reject("no results returned");
		})
	})
};


// Assignment 2 - Part 2 Step 4 Writing the data-service.js module
// Updated in Assignment 5 - Update Existing data-service.js functions
module.exports.getDepartments = function() {
    return new Promise(function (resolve, reject) {
		Department.findAll()
        .then(function(data) {
			resolve(data);
		})
        .catch(function() {
			reject("no results returned");
		})
	})
};


// Assignment 3 - Part 3 Step 3 Adding "addEmployee" function within data-service.js
// Updated in Assignment 5 - Update Existing data-service.js functions
module.exports.addEmployee = function(employeeData) {
    return new Promise(function (resolve, reject) {
		employeeData.isManager = (employeeData.isManager) ? true : false;
		
        for (var i in employeeData)
            if (employeeData[i] == "")
				employeeData[i] = null;
		
		Employee.create(employeeData)
        .then(function (employeeData) {
            resolve(employeeData);
        })
        .catch(function (err) {
            reject("unable to create employee");
        })
    });
};


// Assignment 4 Part 5 Step 1
// Updated in Assignment 5 - Update Existing data-service.js functions
module.exports.updateEmployee = function(employeeData) {
    return new Promise(function (resolve, reject) {
		employeeData.isManager = (employeeData.isManager) ? true : false;
		
        for (var i in employeeData)
            if (employeeData[i] == "")
				employeeData[i] = null;

        Employee.update(employeeData, {
            where: { 
				employeeNum: employeeData.employeeNum 
			} 
        })
        .then(function (employeeData) {
            resolve(employeeData);
        })
        .catch(function (err) {
            reject("unable to update employee");
        });
    });
};


// Assignment 5 - Update Existing data-service.js functions
module.exports.addDepartment = function(departmentData) {
    return new Promise(function (resolve, reject) {
        for (var i in departmentData)
            if (departmentData[i] == "")
                departmentData[i] = null;
    
		Department.create({
			departmentId: departmentData.departmentId,
			departmentName: departmentData.departmentName
		})
        .then(function (Department) {
            resolve(Department);
        })
        .catch(function (err) {
            reject("unable to create department");
        });
    });
};


// Assignment 5 - Update Existing data-service.js functions
module.exports.updateDepartment = function(departmentData) {
    return new Promise(function (resolve, reject) {
		for (var i in departmentData)
            if (departmentData[i] == "")
				departmentData[i] = null;
		Department.update(
			departmentData, {
				where: {
					departmentId: departmentData.departmentId
				}
			}
		)
        .then(function (data) {
            resolve(data);
        })
        .catch(function (err) {
            reject("unable to update department");
        });
    });
};


// Assignment 5 - Update Existing data-service.js functions
module.exports.getDepartmentById = function(id) {
    return new Promise(function (resolve, reject) {
		Department.findAll({
			where: {
				departmentId: id
			}
		})
        .then(function (data) {
            //resolve(data);
            resolve(data[0]);
        })
        .catch(function (err) {
            reject("no results returned");
        });
    });
};


// Assignment 5 - Update Existing data-service.js functions
module.exports.deleteDepartmentById = function(id) {
    return new Promise(function (resolve, reject) {
		Department.destroy({
			where: {
				departmentId: id
			}
		})
        .then(function () {
            resolve();
        })
        .catch(function (err) {
            reject("unable to destroy department");
        });
    });
};



module.exports.deleteEmployeeByNum = function(empNum) {
    return new Promise(function (resolve, reject) {
		Employee.destroy({
			where: {
				employeeNum: empNum
			}
		})
        .then(function () {
            resolve();
        })
        .catch(function (err) {
            reject("unable to delete employee");
        });
    });
};


//Unused and unupdated in assignment 5??
// // Assignment 2 - Part 2 Step 4 Writing the data-service.js module
// module.exports.getManagers = function() {
//     // var employeesManagers = [];
//     // return new Promise (function(resolve, reject) {
//     //     if (employees.length == 0) {
//     //         reject("no results to return");
//     //     }
//     //     else {
//     //         for (var i = 0; i < employees.length; i++) {
//     //             if (employees[i].isManager == true) {
//     //                 employeesManagers.push(employees[i]);
//     //             }
//     //         }
//     //         resolve(employeesManagers);
//     //     }
//     // });
//     return new Promise(function (resolve, reject) {
//         reject();
//         });
// };