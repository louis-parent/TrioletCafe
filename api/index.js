import * as dotenv from "dotenv";
import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

function boot()
{
	return new Promise((success, error) => {
		dotenv.config();
		success();
	});
}

function openDatabase()
{
	return open({
		filename: process.env.DATABASE_PATH,
		driver: sqlite3.Database
	}).then((database) => {
		console.log("Database Connected");
		return database;
	});
}

function setupDatabase(database)
{
	return new Promise((success, error) => {
		database.exec("DROP TABLE IF EXISTS Locations;").then(() => {
			database.exec("CREATE TABLE Locations(name TEXT PRIMARY KEY, latitude REAL, longitude REAL, zoom INTEGER);").then(() => {
				database.exec("INSERT INTO Locations(name, latitude, longitude, zoom) VALUES('Triolet', 43.63278, 3.86451, 18);").then(() => {
					database.exec("DROP TABLE IF EXISTS CoffeeMachines;").then(() => {
						database.exec("CREATE TABLE CoffeeMachines(id INTEGER PRIMARY KEY AUTOINCREMENT, latitude REAL, longitude REAL, description TEXT);").then(() => {
							database.exec("INSERT INTO CoffeeMachines(latitude, longitude, description) VALUES(43.63304914328182, 3.862113786201999, 'Machine au premier étage');").then(() => {
								database.exec("DROP TABLE IF EXISTS SnackMachines;").then(() => {
									database.exec("CREATE TABLE SnackMachines(id INTEGER PRIMARY KEY AUTOINCREMENT, latitude REAL, longitude REAL, description TEXT);").then(() => {
										database.exec("INSERT INTO SnackMachines(latitude, longitude, description) VALUES(43.63304914328182, 3.862113786201999, 'Machine au premier étage');").then(() => {
											success(database);
										});
									});
								});
							});
						});
						
					});
				});
			});
		});	
	}).then((database) => {
		console.log("Data created");
		return database;
	});
}

function openServer(database)
{
	const app = express();
	
	app.get("/coffee", (request, response) => {
		database.all("SELECT latitude, longitude, description FROM CoffeeMachines;").then((coffees) => {		
			response.json(coffees);
		}).catch(() => {
			response.status(500);
			response.send("Internal error while fetching coffee machines");
		});
	});
	
	app.get("/coffee/:id", (request, response) => {
		const id = request.params.id;
		
		database.get("SELECT latitude, longitude, description FROM CoffeeMachines WHERE id = ?;", id).then((coffee) => {		
			if(coffee !== undefined)
			{
				response.json(coffee);
			}
			else
			{
				response.status(404).send("Cannot found coffee machine with id " + id);
			}
		}).catch(() => {
			response.status(500).send("Internal error while fetching coffee machines");
		});
	});
	
	app.get("/snack", (request, response) => {
		database.all("SELECT latitude, longitude, description FROM SnackMachines;").then((snacks) => {		
			response.json(snacks);
		}).catch(() => {
			response.status(500).send("Internal error while fetching snack machines");
		});
	});
	
	app.get("/snack/:id", (request, response) => {
		const id = request.params.id;
		
		database.get("SELECT latitude, longitude, description FROM SnackMachines WHERE id = ?;", id).then((snack) => {		
			if(id !== undefined)
			{
				response.json(snack);			
			}
			else
			{
				response.status(404).send("Cannot find snack machine with id " + id);
			}
		}).catch(() => {
			response.status(500).send("Internal error while fetching snack machines");
		});
	});
	
	app.listen(process.env.PORT);
	console.log("API started on port", process.env.PORT);
}

boot().then(openDatabase).then(setupDatabase).then(openServer);
