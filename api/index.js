import * as dotenv from "dotenv";

import express from "express";
import cors from "cors";

import sqlite3 from "sqlite3";
import { open } from "sqlite";

function requestLogger(request, response, next)
{
	console.log("Received :", request.originalUrl);
	next();
}

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
	app.use(cors());
	app.use(requestLogger);
	
	app.get("/triolet", (request, response) => {
		database.get("SELECT latitude, longitude, zoom FROM Locations WHERE name = 'Triolet';").then((location) => {
			response.json(location);
		}).catch(() => {
			response.status(500);
			response.send("Internal error while fetching triolet location");
		});
	});
	
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
	
	app.get("/nearby/coffee/:latitude/:longitude", (request, response) => {
		const origin = {
			latitude: request.params.latitude,
			longitude: request.params.longitude
		};
		
		database.all("SELECT latitude, longitude FROM CoffeeMachines;").then((destinations) => {		
			if(destinations.length > 0)
			{
				let min = null;
				
				for(const destination of destinations)
				{
					const currentDistance = distanceBetweenGPSLocation(origin, destination);
					
					if(min === null || min.distance > currentDistance)
					{
						min = destination;
						min.distance = currentDistance;
					}
				}
				
				response.json({
					latitude: min.latitude,
					longitude: min.longitude
				});
			}
			else
			{
				response.status(404).send("Cannot find nearby coffee machine");
			}
		}).catch((error) => {
			response.status(500).send("Internal error while findinf nearby coffee machines");
		});
	});
	
	app.listen(process.env.PORT);
	console.log("API started on port", process.env.PORT);
}


function distanceBetweenGPSLocation(location1, location2)
{
	const averageEarthRadius = 6371;
	return Math.acos(Math.sin(degreesToRadians(location1.latitude)) * Math.sin(degreesToRadians(location2.latitude)) + Math.cos(degreesToRadians(location1.latitude)) * Math.cos(degreesToRadians(location2.latitude)) * Math.cos(degreesToRadians(location1.longitude - location2.longitude))) * averageEarthRadius;
}

function degreesToRadians(degrees)
{
	return degrees * (Math.PI / 180);
}	


boot().then(openDatabase).then(setupDatabase).then(openServer);
