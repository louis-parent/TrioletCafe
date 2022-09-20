import express from "express";
import cors from "cors";

class Entity
{
	constructor(name, id, properties, access)
	{
		this.name = name || crypto.randomUUID();
		this.properties = {
			id: undefined,
			other: new Array()
		};
		
		this.setId(id);
		this.setProperties(properties);
		this.setAccess(access);
	}
	
	getName()
	{
		return this.name;
	}
	
	setId(id)
	{
		if(id !== undefined)
		{
			this.properties.id = this.propertify(id);
		}
	}
	
	setProperties(properties)
	{
		if(Array.isArray(properties))
		{
			this.properties.other = new Array();
			
			for(const property of properties)
			{
				this.addProperty(property);
			}
		}
	}
	
	addProperty(property)
	{
		this.properties.other.push(this.propertify(property));
	}
	
	getProperties()
	{
		return this.properties;
	}
	
	propertify(property)
	{
		if(typeof property === "object")
		{
			return {
				name: property.name,
				type: property.type
			};
		}
		else
		{
			return {
				name: property.toString(),
				type: undefined
			};
		}
	}
	
	setAccess(access) {
		this.setCreate(access.create || null);
		this.setRead(access.read || null);
		this.setReadAll(access.readAll || null);
		this.setUpdate(access.update || null);
		this.setReset(access.reset || null);
		this.setDelete(access.delete || null);
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
		this.router = null;
	}
	
	addEntity(entity)
	{
		this.entities.push(entity);
	}
	
	publish(port)
	{
		this.router = express();
		this.router.use(cors());
		this.router.use(express.json());
		
		this.build();
		
		this.router.listen(port);
	}
	
	build()
	{
		for(const entity of this.entities)
		{
			this.buildRoutesForEntity(entity);
		}
	}
	
	buildRoutesForEntity(entity)
	{
		if(entity.canCreate)
		{
			this.buildCreateRoute(entity);
		}
		
		if(entity.canRead)
		{
			this.buildReadRoute(entity);
		}
		
		if(entity.canReadAll)
		{
			this.buildReadAllRoute(entity);
		}
		
		if(entity.canUpdate)
		{
			this.buildUpdateRoute(entity);
		}
		
		if(entity.canReset)
		{
			this.buildResetRoute(entity);
		}
		
		if(entity.canDelete)
		{
			this.buildDeleteRoute(entity);
		}
	}
	
	buildCreateRoute(entity)
	{
		this.router.post("/" + entity.getName(), (request, response) => {
			const
		});
	}
	
	buildReadRoute(entity)
	{
	
	}
	
	buildReadAllRoute(entity)
	{
	
	}
	
	buildUpdateRoute(entity)
	{
	
	}
	
	buildResetRoute(entity)
	{
	
	}
	
	buildDeleteRoute(entity)
	{
	
	}
	
	matchSpecification(data, entity)
	{
		this.entity
	}
}

export default Laze;
