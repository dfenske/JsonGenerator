//components.js
function HierarchyObj(enterprises, deviceTypes, eventTypes) {
    if (enterprises == null) {
        this.Enterprises = [];
    } else {
        this.Enterprises = enterprises;
    }
    if (deviceTypes == null) {
        this.DeviceTypes = [];
    } else {
        this.DeviceTypes = deviceTypes;
    }
    if (eventTypes == null) {
        this.EventTypes = [];
    } else {
        this.EventTypes = eventTypes;
    }
}

function Enterprise (name, description, id, sites) {
    this.Name = name;
    this.Description = description;
    this.Id = id;
    if (sites == null) {
        this.Sites = [];
    } else {
        this.Sites = sites;
    }
};

function Site(name, description, lat, long, street, zip, city, id, users) {
    this.Name = name;
    this.Description = description;
    this.Lat = lat;
    this.Long = long;
    this.Street = street;
    this.Zip = zip;
    this.City = city;
    this.Id = id;
    if (users == null) {
        this.Users = [];
    } else {
        this.Users = users;
    }
};

function User(email, firstName, lastName, cell, id, devices) {
    this.Email = email;
    this.FirstName = firstName;
    this.LastName = lastName;
    this.Cell = cell;
    this.Id = id;
    if (devices == null) {
        this.Devices = [];
    } else {
        this.Devices = devices;
    }
};

function DeviceType(name, paramList) {
    this.Name = name;
    if (paramList == null) {
        this.ParamList = [];
    } else {
        this.ParamList = paramList;
    }
};

function Device(name, type, brand, model, description, status, lat, long, street, zip, city, typeParams, alerts) {
    this.Name = name;
    this.Type = type;
    this.Brand = brand;
    this.Model = model;
    this.Description = description;
    this.Status = status;
    this.Lat = lat;
    this.Long = long;
    this.Street = street;
    this.Zip = zip;
    this.City = city;
    this.TypeParams = typeParams;
    if (alerts == null) {
        this.Alerts = [];
    } else {
        this.Alerts = alerts;
    }
};

function EventType(name, deviceType, numEvents, paramList) {
    this.Name = name;
    this.DeviceType = deviceType;
    this.NumEvents = numEvents;
    if (paramList == null) {
        this.ParamList = [];
    } else {
        this.ParamList = paramList;
    }
};

function EventTypeParam(name, friendlyName, unit, display, numeric) {
    this.Name = name;
    this.FriendlyName = friendlyName;
    this.Unit = unit;
    this.Display = display;
    this.Numeric = numeric;
}

function Alert(description, parameter, value, severity, message, id) {
    this.Description = description;
    this.Parameter = parameter;
    this.Value = value;
    this.Severity = severity;
    this.Message = message;
    this.Id = id;
};