import express from "express";
import cors from "cors";

class Entity
{
	constructor(name, access)
	{
		this.name = name;
		
		this.create = access.create || null;
		this.read = access.read || null;
		this.readAll = access.readAll || null;
		this.update = access.update || null;
		this.reset = access.reset || null;
		this.delete = access.delete || null;
	}
	
	setCreate(create)
	{
		this.create = create;
	}
	
	canCreate()
	{
		this.create !== null;
	}
	
	setRead(read)
	{
		this.read = read;
	}
	
	canRead()
	{
		return this.read !== null;
	}
	
	setReadAll(readAll)
	{
		this.readAll = readAll;
	}
	
	canReadAll()
	{
		this.readAll !== null;
	}
	
	setUpdate(update)
	{
		this.update = update;
	}
	
	canUpdate()
	{
		return this.update !== null;
	}
	
	setReset(reset)
	{
		this.reset = reset;
	}
	
	canReset()
	{
		return this.reset !== null;
	}
	
	setDelete(delete)
	{
		this.delete = delete;
	}
	
	canDelete()
	{
		return this.delete !== null;
	}
}

class Laze
{
	constructor()
	{
		this.entities = new Array();
	}
	
	addEntity(entity)
	{
		this.entities.push(entity);
	}
	
	publish(port)
	{
		this.router = express();
		this.router.use(cors());
		
		this.build();
		
		this.router.listen(port);
	}
	
	build()
	{
		for(const entity of this.entities)
		{
			this.buildRouteForEntity(entity);
		}
	}
	
	buildRouteForEntity(entity)
	{
		
	}
}

export default Laze;
