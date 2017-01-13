//hierarchyService.js
(function () {

    'use strict';

    angular.module('webApp')
        .factory('hierarchyService', ['$filter', '$rootScope', function ($filter, $rootScope) {
            var hierarchyObj = new HierarchyObj();

            /** SAVE **/
            var TrySaveEnterprise = function (data) {
                if (hierarchyObj == [] || hierarchyObj == null) {
                    hierarchyObj = new HierarchyObj();
                }
                // TODO: Check if input valid

                // TODO: If invalid, break - show errors.

                // If valid, continue:
                var exists = EnterpriseExists(data);
                var enterprise = ConstructEnterpriseFromForm(data, exists);

                if (enterprise != null) {
                    if (exists) {
                        // Overwrite existing record
                        OverwriteEnterprise(enterprise);
                    } else {
                        // Create a new record
                        hierarchyObj.Enterprises.push(enterprise);
                    }
                    return true;
                }
                else {
                    // Failed to create and save
                    return false;
                }
            };

            var TrySaveSite = function (data) {
                // TODO: Check if input valid

                // TODO: If invalid, break - show errors.

                // If valid, continue:
                var exists = SiteExists(data);
                var siteInfo = ConstructSiteFromForm(data, exists);

                if (siteInfo.site != null) {
                    if (exists) {
                        // Overwrite existing record
                        OverwriteSite(siteInfo.site);
                    } else {
                        // Create a new record
                        var enterpriseObj = GetComponentByTypeAndId('Enterprise', siteInfo.parent);
                        enterpriseObj.Sites.push(siteInfo.site);
                        return true;
                    }
                }
                else {
                    // Failed to save
                    return false;
                }

            };

            var TrySaveUser = function (data) {
                // TODO: Check if input valid

                // TODO: If invalid, break - show errors.

                // If valid, continue:
                var exists = UserExists(data);
                var userInfo = ConstructUserFromForm(data, exists);

                if (userInfo.user != null) {
                    if (exists) {
                        // Overwrite existing record
                        OverwriteUser(userInfo.user);
                    } else {
                        //Go through all sites, looking for the one this user belongs to
                        var siteObj = GetComponentByTypeAndId('Site', userInfo.parent);
                        if (siteObj != null) {
                            siteObj.Users.push(userInfo.user)
                            return true;
                        };
                    }
                }
                else {
                    // Failed to save
                    return false;
                }
            };

            var TrySaveDeviceType = function (data) {
                // TODO: Check if input valid

                // TODO: If invalid, break - show errors.

                // If valid, continue:
                var exists = DeviceTypeExists(data);
                var deviceType = ConstructDeviceTypeFromForm(data);

                if (deviceType != null) {
                    if (exists) {
                        // Overwrite existing record
                        OverwriteDeviceType(deviceType);
                    } else {
                        hierarchyObj.DeviceTypes.push(deviceType);
                        return true;
                    }
                }
                else {
                    // Failed to save
                    return false;
                }
            };

            var TrySaveDevice = function (data) {
                // TODO: Check if input valid

                // TODO: If invalid, break - show errors.

                // If valid, continue:
                var exists = DeviceExists(data);
                var deviceInfo = ConstructDeviceFromForm(data);

                if (deviceInfo.device != null) {
                    if (exists) {
                        // Overwrite existing record
                        OverwriteDevice(deviceInfo.device);
                    } else {
                        //Go through all sites, looking for the one this user belongs to
                        var userObj = GetComponentByTypeAndId('User', deviceInfo.supervisor);
                        if (userObj != null) {
                            userObj.Devices.push(deviceInfo.device)
                            return true;
                        };
                    }
                }
                else {
                    // Failed to save
                    return false;
                }
            };

            var TrySaveEventType = function (data) {
                // TODO: Check if input valid

                // TODO: If invalid, break - show errors.

                // If valid, continue:
                var exists = EventTypeExists(data);
                var eventType = ConstructEventTypeFromForm(data);

                if (eventType != null) {
                    if (exists) {
                        // Overwrite existing record
                        OverwriteEventType(eventType);
                    } else {
                        hierarchyObj.EventTypes.push(eventType);
                    }
                    return true;
                }
                else {
                    // Failed to save
                    return false;
                }
            };

            var TrySaveAlert = function (data) {
                // TODO: Check if input valid

                // TODO: If invalid, break - show errors.

                // If valid, continue:
                var exists = AlertExists(data);
                var alertInfo = ConstructAlertFromForm(data, exists);

                if (alertInfo.alert != null) {
                    if (exists) {
                        // Overwrite existing record
                        OverwriteAlert(alertInfo.alert);
                    } else {
                        //Go through all sites, looking for the one this user belongs to
                        var deviceObj = GetComponentByTypeAndName('Device', alertInfo.device);
                        if (deviceObj != null) {
                            deviceObj.Alerts.push(alertInfo.alert)
                            return true;
                        };
                    }
                }
                else {
                    // Failed to save
                    return false;
                }
            };

            /** DELETE **/
            var TryDeleteEnterprise = function (data) {
                if (hierarchyObj == null || !EnterpriseExists(data) || EnterpriseHasChildren(data)) {
                    return false;
                } else {
                    var name = $filter("filter")(data, { Name: 'EnterpriseName' }, true)[0].Value;
                    DeleteEnterprise(name);
                    return true;
                }
            };

            var TryDeleteSite = function (data) {
                if (hierarchyObj == null || !SiteExists(data) || SiteHasChildren(data)) {
                    return false;
                } else {
                    var name = $filter("filter")(data, { Name: 'SiteName' }, true)[0].Value;
                    DeleteSite(name);
                    return true;
                }
            };

            var TryDeleteUser = function (data) {
                if (hierarchyObj == null || !UserExists(data) || UserHasChildren(data)) {
                    return false;
                } else {
                    var name = $filter("filter")(data, { Name: 'UserDescription' }, true)[0].Value;
                    DeleteUser(name);
                    return true;
                }
            };

            var TryDeleteDeviceType = function (data) {
                if (hierarchyObj == null || !DeviceTypeExists(data) || DeviceTypeHasChildren(data)) {
                    return false;
                } else {
                    var name = $filter("filter")(data, { Name: 'DeviceTypeName' }, true)[0].Value;
                    DeleteDeviceType(name);
                    return true;
                }
            };

            var TryDeleteDevice = function (data) {
                if (hierarchyObj == null || !DeviceExists(data) || DeviceHasChildren(data)) {
                    return false;
                } else {
                    var name = $filter("filter")(data, { Name: 'DeviceID' }, true)[0].Value;
                    DeleteDevice(name);
                    return true;
                }
            };

            var TryDeleteEventType = function (data) {
                if (hierarchyObj == null || !EventTypeExists(data) || EventTypeHasChildren(data)) {
                    return false;
                } else {
                    var name = $filter("filter")(data, { Name: 'EventTypeName' }, true)[0].Value;
                    DeleteEventType(name);
                    return true;
                }
            };

            var TryDeleteAlert = function (data) {
                if (hierarchyObj == null || !AlertExists(data)) {
                    return false;
                } else {
                    var name = $filter("filter")(data, { Name: 'AlertDescription' }, true)[0].Value;
                    DeleteAlert(name);
                    return true;
                }
            };

            /** EXISTENCE **/
            var EnterpriseExists = function (data) {
                if (hierarchyObj != null && hierarchyObj != []) {
                    var name = $filter("filter")(data, { Name: 'EnterpriseName' }, true)[0].Value;
                    var obj = GetComponentByTypeAndName('Enterprise', name);
                    if (obj == null) {
                        return false;
                    } else {
                        return true;
                    }
                }
            };

            var SiteExists = function (data) {
                var name = $filter("filter")(data, { Name: 'SiteName' }, true)[0].Value;
                var obj = GetComponentByTypeAndName('Site', name);
                if (obj == null) {
                    return false;
                } else {
                    return true;
                }
            };

            var UserExists = function (data) {
                var email = $filter("filter")(data, { Name: 'UserDescription' }, true)[0].Value;
                var obj = GetComponentByTypeAndName('User', email);
                if (obj == null) {
                    return false;
                } else {
                    return true;
                }
            };

            var DeviceTypeExists = function (data) {
                var name = $filter("filter")(data, { Name: 'DeviceTypeName' }, true)[0].Value;
                var obj = GetComponentByTypeAndName('DeviceType', name);
                if (obj == null) {
                    return false;
                } else {
                    return true;
                }
            };

            var DeviceExists = function (data) {
                var name = $filter("filter")(data, { Name: 'DeviceID' }, true)[0].Value;
                var obj = GetComponentByTypeAndName('Device', name);
                if (obj == null) {
                    return false;
                } else {
                    return true;
                }
            };

            var EventTypeExists = function (data) {
                var name = $filter("filter")(data, { Name: 'EventTypeName' }, true)[0].Value;
                var obj = GetComponentByTypeAndName('EventType', name);
                if (obj == null) {
                    return false;
                } else {
                    return true;
                }
            };

            var AlertExists = function (data) {
                var name = $filter("filter")(data, { Name: 'AlertDescription' }, true)[0].Value;
                var obj = GetComponentByTypeAndName('Alert', name);
                if (obj == null) {
                    return false;
                } else {
                    return true;
                }
            };

            /** OVERWRITING **/
            var OverwriteEnterprise = function (enterpriseObj) {
                angular.forEach(hierarchyObj.Enterprises, function (obj, key) {
                    if (obj.Id === enterpriseObj.Id) {
                        // Overwrite all the properties except the Sites array and the ID
                        obj.Name = enterpriseObj.Name;
                        obj.Description = enterpriseObj.Description;
                    }
                });
            };

            var OverwriteSite = function (siteObj) {
                angular.forEach(hierarchyObj.Enterprises, function (entObj, key) {
                    angular.forEach(entObj.Sites, function (obj, key) {
                        //overwrite all the properties except the Users array and the ID.
                        if (obj.Id == siteObj.Id) {
                            obj.Name = siteObj.Name;
                            obj.Description = siteObj.Description;
                            obj.Lat = siteObj.Lat;
                            obj.Long = siteObj.Long;
                            obj.Street = siteObj.Street;
                            obj.Zip = siteObj.Zip;
                            obj.City = siteObj.City;
                        }
                    });
                });
            };

            var OverwriteUser = function (userObj) {
                angular.forEach(hierarchyObj.Enterprises, function (entObj, key) {
                    angular.forEach(entObj.Sites, function (siteObj, key) {
                        angular.forEach(siteObj.Users, function (obj, key) {
                            //overwrite all the properties except the Devices array and the ID.
                            if (obj.Id == userObj.Id) {
                                obj.Email = userObj.Email;
                                obj.FirstName = userObj.FirstName;
                                obj.LastName = userObj.LastName;
                                obj.Cell = userObj.Cell;
                            }
                        });
                    });
                });
            };

            var OverwriteDeviceType = function (deviceTypeObj) {
                angular.forEach(hierarchyObj.DeviceTypes, function (obj, key) {
                    if (obj.Name === deviceTypeObj.Name) {
                        // Overwrite the param list
                        obj.ParamList = deviceTypeObj.ParamList;
                    }
                });
            };

            var OverwriteDevice = function (deviceObj) {
                angular.forEach(hierarchyObj.Enterprises, function (entObj, key) {
                    angular.forEach(entObj.Sites, function (siteObj, key) {
                        angular.forEach(siteObj.Users, function (userObj, key) {
                            angular.forEach(userObj.Devices, function (obj, key) {
                                //overwrite all the properties except the Alerts array.
                                if (obj.Name === deviceObj.Name) {
                                    obj.Type = deviceObj.Type;
                                    obj.Brand = deviceObj.Brand;
                                    obj.Model = deviceObj.Model;
                                    obj.Description = deviceObj.Description;
                                    obj.Status = deviceObj.Status;
                                    obj.Lat = deviceObj.Lat;
                                    obj.Long = deviceObj.Long;
                                    obj.Street = deviceObj.Street;
                                    obj.Zip = deviceObj.Zip;
                                    obj.City = deviceObj.City;
                                    obj.TypeParams = deviceObj.TypeParams;
                                }
                            });
                        });
                    });
                });
            };

            var OverwriteEventType = function (eventTypeObj) {
                angular.forEach(hierarchyObj.EventTypes, function (obj, key) {
                    if (obj.Name === eventTypeObj.Name) {
                        // Overwrite the device type, numEvents, and param list
                        obj.DeviceType = eventTypeObj.DeviceType;
                        obj.NumEvents = eventTypeObj.NumEvents;
                        obj.ParamList = eventTypeObj.ParamList;
                    }
                });
            };

            var OverwriteAlert = function (alertObj) {
                angular.forEach(hierarchyObj.Enterprises, function (entObj, key) {
                    angular.forEach(entObj.Sites, function (siteObj, key) {
                        angular.forEach(siteObj.Users, function (userObj, key) {
                            angular.forEach(userObj.Devices, function (deviceObj, key) {
                                angular.forEach(deviceObj.Alerts, function (obj, key) {
                                    if (obj.Id == alertObj.Id) {
                                        obj.Description = alertObj.Description;
                                        obj.Parameter = alertObj.Parameter;
                                        obj.Value = alertObj.Value;
                                        obj.Severity = alertObj.Severity;
                                        obj.Message = alertObj.Message;
                                    }
                                });
                            });
                        });
                    });
                });
            };

            /** DEPENDENCIES **/
            var EnterpriseHasChildren = function (data) {
                var name = $filter("filter")(data, { Name: 'EnterpriseName' }, true)[0].Value;
                var obj = GetComponentByTypeAndName('Enterprise', name);
                if (obj != null && obj.Sites.length > 0) {
                    return true;
                } else {
                    return false;
                }
            };

            var SiteHasChildren = function (data) {
                var name = $filter("filter")(data, { Name: 'SiteName' }, true)[0].Value;
                var obj = GetComponentByTypeAndName('Site', name);
                if (obj != null && obj.Users.length > 0) {
                    return true;
                } else {
                    return false;
                }
            };

            var UserHasChildren = function (data) {
                var email = $filter("filter")(data, { Name: 'UserDescription' }, true)[0].Value;
                var obj = GetComponentByTypeAndName('User', email);
                if (obj != null && obj.Devices.length > 0) {
                    return true;
                } else {
                    return false;
                }
            };

            var DeviceTypeHasChildren = function (data) {
                var hasChildren = false;
                var name = $filter("filter")(data, { Name: 'DeviceTypeName' }, true)[0].Value;
                angular.forEach(hierarchyObj.Enterprises, function (entObj, key) {
                    angular.forEach(entObj.Sites, function (siteObj, key) {
                        angular.forEach(siteObj.Users, function (userObj, key) {
                            var possibleDevice = $filter("filter")(userObj.Devices, { Type: name }, true)[0];
                            if (possibleDevice != null) { hasChildren = true; }
                        });
                    });
                });
                // Also check if any event type is associated with this device type.
                angular.forEach(hierarchyObj.EventTypes, function (eventTypeObj, key) {
                    if (eventTypeObj.DeviceType == name) {
                        hasChildren = true;
                    }
                });
                return hasChildren;
            };

            var DeviceHasChildren = function (data) {
                // TODO check if there have been events generated for the device?
                var name = $filter("filter")(data, { Name: 'DeviceID' }, true)[0].Value;
                var obj = GetComponentByTypeAndName('Device', name);
                if (obj != null && obj.Alerts.length > 0) {
                    return true;
                } else {
                    return false;
                }
            };

            var EventTypeHasChildren = function (data) {
                var name = $filter("filter")(data, { Name: 'EventTypeName' }, true)[0].Value;
                var obj = GetComponentByTypeAndName('EventType', name);
                var params = obj.ParamList;
                if (obj != null) {
                    var toReturn = false;
                    angular.forEach(hierarchyObj.Enterprises, function (obj, key) {
                        angular.forEach(obj.Sites, function (site, key) {
                            angular.forEach(site.Users, function (user, key) {
                                angular.forEach(user.Devices, function (device, key) {
                                    angular.forEach(device.Alerts, function (alert, key) {
                                        angular.forEach(params, function (param, key) {
                                            //if an alert has a parameter that corresponds to a parameter in this event type's list, there is a dependency.
                                            if (alert.Parameter == param.Name) {
                                                toReturn = true;
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                    return toReturn;
                } else {
                    return false;
                }

                return false;
            };

            /** GETTERS **/
            var GetAllEnterprises = function () {
                var list = [];
                angular.forEach(hierarchyObj.Enterprises, function (obj, key) {
                    list.push(
                        {
                            Name: obj.Name,
                            Value: obj.Id,
                            Selected: false
                        });
                });
                if (list.length > 0) list[0].Selected = true;
                return list;
            };

            var GetAllSites = function () {
                var list = [];
                angular.forEach(hierarchyObj.Enterprises, function (obj, key) {
                    angular.forEach(obj.Sites, function (site, key) {
                        list.push(
                        {
                            Name: site.Name,
                            Value: site.Id,
                            Selected: false
                        });
                    });
                });
                if (list.length > 0) list[0].Selected = true;
                return list;
            };

            var GetAllUsers = function () {
                var list = [];
                angular.forEach(hierarchyObj.Enterprises, function (obj, key) {
                    angular.forEach(obj.Sites, function (site, key) {
                        angular.forEach(site.Users, function (user, key) {
                            list.push({
                                Name: user.Email,
                                Value: user.Id,
                                Selected: false
                            });
                        });
                    });
                });
                if (list.length > 0) list[0].Selected = true;
                return list;
            };

            var GetAllDeviceTypes = function () {
                var list = [];
                angular.forEach(hierarchyObj.DeviceTypes, function (obj, key) {
                    list.push(
                        {
                            Name: obj.Name,
                            Value: obj.Name,
                            Selected: false
                        });
                });
                return list;
            };

            var GetAllDevices = function () {
                var list = [];
                angular.forEach(hierarchyObj.Enterprises, function (obj, key) {
                    angular.forEach(obj.Sites, function (site, key) {
                        angular.forEach(site.Users, function (user, key) {
                            angular.forEach(user.Devices, function (device, key) {
                                list.push({
                                    Name: device.Name,
                                    Value: device.Name,
                                    Selected: false
                                });
                            });
                        });
                    });
                });
                if (list.length > 0) list[0].Selected = true;
                return list;
            };

            var GetAllAlerts = function () {
                var list = [];
                angular.forEach(hierarchyObj.Enterprises, function (obj, key) {
                    angular.forEach(obj.Sites, function (site, key) {
                        angular.forEach(site.Users, function (user, key) {
                            angular.forEach(user.Devices, function (device, key) {
                                angular.forEach(device.Alerts, function (alert, key) {
                                    list.push({
                                        Name: alert.Description,
                                        Value: alert.Id,
                                        Selected: false
                                    });
                                });
                            });
                        });
                    });
                });
                if (list.length > 0) list[0].Selected = true;
                return list;
            };

            var GetAllParams = function () {
                var list = [];
                angular.forEach(hierarchyObj.EventTypes, function (obj, key) {
                    angular.forEach(obj.ParamList, function (param, key) {
                        list.push({
                            Name: param.FriendlyName,
                            Value: param.Name,
                            Selected: true
                        });
                    });
                })
                return list;
            };

            var GetParamsForDeviceType = function (name) {
                return $filter("filter")(hierarchyObj.DeviceTypes, { Name: name }, true)[0].ParamList;
            };

            var GetComponentByTypeAndName = function (componentType, name) {
                var objToReturn;
                switch (componentType) {
                    case 'Enterprise':
                        objToReturn = $filter("filter")(hierarchyObj.Enterprises, { Name: name }, true)[0];
                        break;
                    case 'Site':
                        angular.forEach(hierarchyObj.Enterprises, function (obj, key) {
                            var possibleSite = $filter("filter")(obj.Sites, { Name: name }, true)[0];
                            if (possibleSite != null) {
                                // we found it! Save to the variable.
                                objToReturn = possibleSite;
                            }
                        });
                        break;
                    case 'User':
                        angular.forEach(hierarchyObj.Enterprises, function (obj, key) {
                            angular.forEach(obj.Sites, function (siteObj, key) {
                                var possibleUser = $filter("filter")(siteObj.Users, { Email: name }, true)[0];
                                if (possibleUser != null) {
                                    // we found it! Save to the variable.
                                    objToReturn = possibleUser;
                                };
                            });
                        });
                        break;
                    case 'DeviceType':
                        objToReturn = $filter("filter")(hierarchyObj.DeviceTypes, { Name: name }, true)[0];
                        break;
                    case 'Device':
                        angular.forEach(hierarchyObj.Enterprises, function (obj, key) {
                            angular.forEach(obj.Sites, function (siteObj, key) {
                                angular.forEach(siteObj.Users, function (userObj, key) {
                                    var possibleDevice = $filter("filter")(userObj.Devices, { Name: name }, true)[0];
                                    if (possibleDevice != null) {
                                        // we found it! Save to the variable.
                                        objToReturn = possibleDevice;
                                    };
                                });
                            });
                        });
                        break;
                    case 'EventType':
                        objToReturn = $filter("filter")(hierarchyObj.EventTypes, { Name: name }, true)[0];
                        break;
                    case 'Alert':
                        angular.forEach(hierarchyObj.Enterprises, function (obj, key) {
                            angular.forEach(obj.Sites, function (siteObj, key) {
                                angular.forEach(siteObj.Users, function (userObj, key) {
                                    angular.forEach(userObj.Devices, function (deviceObj, key) {
                                        var possibleAlert = $filter("filter")(deviceObj.Alerts, { Description: name }, true)[0];
                                        if (possibleAlert != null) {
                                            // we found it! Save to the variable.
                                            objToReturn = possibleAlert;
                                        };
                                    });
                                });
                            });
                        });
                        break;
                    default:
                        break;
                }
                return objToReturn;
            };

            var GetComponentByTypeAndId = function (componentType, id) {
                var objToReturn;
                switch (componentType) {
                    case 'Enterprise':
                        objToReturn = $filter("filter")(hierarchyObj.Enterprises, { Id: id })[0];
                        break;
                    case 'Site':
                        angular.forEach(hierarchyObj.Enterprises, function (obj, key) {
                            var possibleSite = $filter("filter")(obj.Sites, { Id: id })[0];
                            if (possibleSite != null) {
                                // we found it! Save to the variable.
                                objToReturn = possibleSite;
                            }
                        });
                        break;
                    case 'User':
                        angular.forEach(hierarchyObj.Enterprises, function (obj, key) {
                            angular.forEach(obj.Sites, function (siteObj, key) {
                                var possibleUser = $filter("filter")(siteObj.Users, { Id: id })[0];
                                if (possibleUser != null) {
                                    // we found it! Save to the variable.
                                    objToReturn = possibleUser;
                                }
                            });
                        });
                        break;
                    case 'DeviceType':

                        break;
                    case 'Device':

                        break;
                    case 'EventType':

                        break;
                    case 'Alert':

                        break;
                    default:
                        break;
                }
                return objToReturn;
            };

            /** CONSTRUCTORS **/
            var ConstructEnterpriseFromForm = function (data, exists) {
                var id;
                var name = $filter("filter")(data, { Name: 'EnterpriseName' }, true)[0].Value;
                var description = $filter("filter")(data, { Name: 'EnterpriseDescription' }, true)[0].Value;

                //If it doesn't exist yet, generate an ID
                if (!exists) {
                    id = GetNextEnterpriseId();
                } else {
                    // Otherwise, get the existing ID:
                    id = GetComponentByTypeAndName("Enterprise", name).Id;
                }
                // Create the enterprise
                if (name != null && description != null) {
                    var enterprise = new Enterprise(name, description, id);
                    return enterprise;
                } else {
                    return null;
                }
            };

            var ConstructSiteFromForm = function (data, exists) {
                var id;
                var name = $filter("filter")(data, { Name: 'SiteName' }, true)[0].Value;
                var description = $filter("filter")(data, { Name: 'SiteDescription' }, true)[0].Value;
                var parent = $filter("filter")(data, { Name: 'SiteParentUserName' }, true)[0].Value;
                var lat = $filter("filter")(data, { Name: 'Map' }, true)[0].Lat;
                var long = $filter("filter")(data, { Name: 'Map' }, true)[0].Long;
                var street = $filter("filter")(data, { Name: 'Map' }, true)[0].Street;
                var zip = $filter("filter")(data, { Name: 'Map' }, true)[0].ZipCode;
                var city = $filter("filter")(data, { Name: 'Map' }, true)[0].City;
                //If it doesn't exist yet, generate an ID
                if (!exists) {
                    id = GetNextSiteId();
                } else {
                    // Otherwise, get the existing ID:
                    id = GetComponentByTypeAndName("Site", name).Id;
                }
                //Create the site
                if (name != null && description != null && parent != null) {
                    var site = new Site(name, description, lat, long, street, zip, city, id);
                    return {
                        site: site,
                        parent: parent
                    }
                } else {
                    return null;
                }

            };

            var ConstructUserFromForm = function (data, exists) {
                var id;
                var email = $filter("filter")(data, { Name: 'UserDescription' }, true)[0].Value;
                var parent = $filter("filter")(data, { Name: 'UserParentName' }, true)[0].Value;
                var firstName = $filter("filter")(data, { Name: 'UserFirstName' }, true)[0].Value;
                var lastName = $filter("filter")(data, { Name: 'UserLastName' }, true)[0].Value;
                var mobile = $filter("filter")(data, { Name: 'UserMobile' }, true)[0].Value;
                if (!exists) {
                    //Generate new ID if doesn't already exist
                    id = GetNextUserId();
                } else {
                    // Otherwise, get the existing ID
                    id = GetComponentByTypeAndName("User", email).Id;
                }
                // Create the User
                if (email != null && firstName != null && lastName != null && mobile != null) {
                    var user = new User(email, firstName, lastName, mobile, id);
                    return {
                        user: user,
                        parent: parent
                    }
                } else {
                    return null;
                }

            };

            var ConstructDeviceTypeFromForm = function (data) {
                // If it doesn't exist need to generate ID and create new record.
                var name = $filter("filter")(data, { Name: 'DeviceTypeName' }, true)[0].Value;
                var paramList = $filter("filter")(data, { Name: 'DeviceTypeParams' }, true)[0].ParamArray;
                if (name != null && paramList != null) {
                    var deviceType = new DeviceType(name, paramList);
                    return deviceType;
                } else {
                    return null;
                }
            };

            var ConstructDeviceFromForm = function (data) {
                var name = $filter("filter")(data, { Name: 'DeviceID' }, true)[0].Value;
                var type = $filter("filter")(data, { Name: 'DeviceType' }, true)[0].Value;
                var supervisor = $filter("filter")(data, { Name: 'DeviceSupervisor' }, true)[0].Value;
                var brand = $filter("filter")(data, { Name: 'DeviceBrand' }, true)[0].Value;
                var model = $filter("filter")(data, { Name: 'DeviceModel' }, true)[0].Value;
                var description = $filter("filter")(data, { Name: 'DeviceDescription' }, true)[0].Value;
                var status = $filter("filter")(data, { Name: 'DeviceStatus' }, true)[0].Value;
                var lat = $filter("filter")(data, { Name: 'Map' }, true)[0].Lat;
                var long = $filter("filter")(data, { Name: 'Map' }, true)[0].Long;
                var street = $filter("filter")(data, { Name: 'Map' }, true)[0].Street;
                var zip = $filter("filter")(data, { Name: 'Map' }, true)[0].ZipCode;
                var city = $filter("filter")(data, { Name: 'Map' }, true)[0].City;
                var paramArray = $filter("filter")(data, { Name: "DeviceTypeParams" }, true)[0].ParamArray;
                if (name != null && type != null && brand != null && model != null
                    && description != null && status != null && lat != null && long != null
                    && street != null && zip != null && city != null) {
                    var device = new Device(name, type, brand, model, description, status, lat, long, street, zip, city, paramArray);
                    return {
                        device: device,
                        supervisor: supervisor
                    }
                } else {
                    return null;
                }
            };

            var ConstructEventTypeFromForm = function (data) {
                // If it doesn't exist need to generate ID and create new record.
                var name = $filter("filter")(data, { Name: 'EventTypeName' }, true)[0].Value;
                var deviceType = $filter("filter")(data, { Name: 'EventDeviceType' }, true)[0].Value;
                var numEvents = $filter("filter")(data, { Name: 'NumEvents' }, true)[0].Value;
                var paramList = $filter("filter")(data, { Name: 'EventTypeParams' }, true)[0].ParamArray;
                if (name != null && deviceType != null && numEvents != null && paramList != null) {
                    var eventType = new EventType(name, deviceType, numEvents, paramList);
                    return eventType;
                } else {
                    return null;
                }
            };

            var ConstructAlertFromForm = function (data, exists) {
                var id;
                var device = $filter("filter")(data, { Name: 'AlertDeviceID' }, true)[0].Value;
                var description = $filter("filter")(data, { Name: 'AlertDescription' }, true)[0].Value;
                var parameter = $filter("filter")(data, { Name: 'AlertParameter' }, true)[0].Value;
                var value = $filter("filter")(data, { Name: 'AlertValue' }, true)[0].Value;
                var severity = $filter("filter")(data, { Name: 'AlertSeverity' }, true)[0].Value;
                var message = $filter("filter")(data, { Name: 'AlertMessage' }, true)[0].Value;
                if (!exists) {
                    // If it doesn't exist yet, generate ID
                    id = GetNextAlertId();
                } else {
                    id = GetComponentByTypeAndName("Alert", description).Id;
                }
                if (device != null && description != null && parameter != null
                    && value != null && severity != null && message != null) {
                    var alert = new Alert(description, parameter, value, severity, message, id);
                    return {
                        alert: alert,
                        device: device
                    };
                } else {
                    return null;
                }
            };

            /** DELETERS **/
            var DeleteEnterprise = function (name) {
                var obj = GetComponentByTypeAndName("Enterprise", name);
                hierarchyObj.Enterprises.splice(hierarchyObj.Enterprises.indexOf(obj), 1);
            };

            var DeleteSite = function (name) {
                angular.forEach(hierarchyObj.Enterprises, function (entObj, key) {
                    var possibleSite = $filter("filter")(entObj.Sites, { Name: name }, true)[0];
                    if (possibleSite != null) {
                        // we found the enterprise with the site we want to delete
                        entObj.Sites.splice(entObj.Sites.indexOf(possibleSite), 1);
                    }
                });
            };

            var DeleteUser = function (email) {
                angular.forEach(hierarchyObj.Enterprises, function (entObj, key) {
                    angular.forEach(entObj.Sites, function (siteObj, key) {
                        var possibleUser = $filter("filter")(siteObj.Users, { Email: email }, true)[0];
                        if (possibleUser != null) {
                            // we found the site with the user we want to delete
                            siteObj.Users.splice(siteObj.Users.indexOf(possibleUser), 1);
                        }
                    });
                });
            };

            var DeleteDeviceType = function (email) {
                var obj = GetComponentByTypeAndName('DeviceType', email);
                hierarchyObj.DeviceTypes.splice(hierarchyObj.DeviceTypes.indexOf(obj), 1);
            };

            var DeleteDevice = function (name) {
                angular.forEach(hierarchyObj.Enterprises, function (entObj, key) {
                    angular.forEach(entObj.Sites, function (siteObj, key) {
                        angular.forEach(siteObj.Users, function (userObj, key) {
                            var possibleDevice = $filter("filter")(userObj.Devices, { Name: name }, true)[0];
                            if (possibleDevice != null) {
                                // we found the user with the device we want to delete
                                userObj.Devices.splice(userObj.Devices.indexOf(possibleDevice), 1);
                            }

                        })
                    });
                });
            };

            var DeleteEventType = function (name) {
                var obj = GetComponentByTypeAndName("EventType", name);
                hierarchyObj.EventTypes.splice(hierarchyObj.EventTypes.indexOf(obj), 1);
            };

            var DeleteAlert = function (name) {
                angular.forEach(hierarchyObj.Enterprises, function (entObj, key) {
                    angular.forEach(entObj.Sites, function (siteObj, key) {
                        angular.forEach(siteObj.Users, function (userObj, key) {
                            angular.forEach(userObj.Devices, function (deviceObj, key) {
                                var possibleAlert = $filter("filter")(deviceObj.Alerts, { Description: name }, true)[0];
                                if (possibleAlert != null) {
                                    // we found the user with the device we want to delete
                                    deviceObj.Alerts.splice(deviceObj.Alerts.indexOf(possibleAlert), 1);
                                }
                            });
                        });
                    });
                });
            };

            /** IDs **/
            var GetNextEnterpriseId = function () {
                var ents = GetAllEnterprises();
                if (ents.length == 0) {
                    // There are none yet, start at this number
                    //TODO: UpdateMaxEnterpriseId(2724);
                    return 2724;
                } else {
                    //build simpler array of JUST values.
                    var allIds = [];
                    angular.forEach(ents, function (entObj, key) {
                        allIds.push(entObj.Value);
                    });
                    return Math.max.apply(Math, allIds) + 1;
                    //TODO: UpdateMaxEnterpriseId(IncrementMaxEnterpriseId())
                }
            };

            var GetNextSiteId = function () {
                var sites = GetAllSites();
                if (sites.length == 0) {
                    // There are none yet, start at this number
                    return 4652;
                } else {
                    //build simpler array of JUST values.
                    var allIds = [];
                    angular.forEach(sites, function (siteObj, key) {
                        allIds.push(siteObj.Value);
                    });
                    return Math.max.apply(Math, allIds) + 1;
                }
            };

            var GetNextUserId = function () {
                var users = GetAllUsers();
                if (users.length == 0) {
                    // There are none yet, start at this number
                    return 9000;
                } else {
                    //build simpler array of JUST values.
                    var allIds = [];
                    angular.forEach(hierarchyObj.Enterprises, function (obj, key) {
                        angular.forEach(obj.Sites, function (siteObj, key) {
                            angular.forEach(siteObj.Users, function (userObj, key) {
                                allIds.push(userObj.Id);
                            });
                        });
                    });
                    return Math.max.apply(Math, allIds) + 1;
                }
            };

            var GetNextAlertId = function () {
                var alerts = GetAllAlerts();
                if (alerts.length == 0) {
                    // There are none yet, start at this number
                    return 12400;
                } else {
                    //build simpler array of JUST values.
                    var allIds = [];
                    angular.forEach(alerts, function (alertObj, key) {
                        allIds.push(alertObj.Value);
                    });
                    return Math.max.apply(Math, allIds) + 1;
                }
            };

            /** RETURN **/
            return {
                /** HIERARCHY OBJECT **/
                GetHierarchyObj: function () { return hierarchyObj; },
                SetHierarchyObj: function (obj) { hierarchyObj = obj; },

                SaveComponent: function (componentType, data) {
                    var worked = false;
                    switch (componentType) {
                        case 'enterprise':
                            worked = TrySaveEnterprise(data);
                            break;
                        case 'site':
                            worked = TrySaveSite(data);
                            break;
                        case 'user':
                            worked = TrySaveUser(data);
                            break;
                        case 'deviceType':
                            worked = TrySaveDeviceType(data);
                            break;
                        case 'device':
                            worked = TrySaveDevice(data);
                            break;
                        case 'eventType':
                            worked = TrySaveEventType(data);
                            break;
                        case 'alert':
                            worked = TrySaveAlert(data);
                            break;
                        default:
                            break;
                    }
                    if (worked) {
                        // Broadcast hierarchy-updated event so we can update scope variable.
                        $rootScope.$broadcast('hierarchy-updated');
                    }
                },
                DeleteComponent: function (componentType, data) {
                    var worked = false;
                    switch (componentType) {
                        case 'enterprise':
                            worked = TryDeleteEnterprise(data);
                            break;
                        case 'site':
                            worked = TryDeleteSite(data);
                            break;
                        case 'user':
                            worked = TryDeleteUser(data);
                            break;
                        case 'deviceType':
                            worked = TryDeleteDeviceType(data);
                            break;
                        case 'device':
                            worked = TryDeleteDevice(data);
                            break;
                        case 'eventType':
                            worked = TryDeleteEventType(data);
                            break;
                        case 'alert':
                            worked = TryDeleteAlert(data);
                            break;
                        default:
                            break;
                    }
                    if (worked) {
                        // Broadcast hierarchy-updated event so we can update scope variable.
                        $rootScope.$broadcast('hierarchy-updated');
                    }
                },

                /** CREATE TREE **/
                CreateTreeFromHierarchy: function () {
                    var tree = [];
                    var tooltip;
                    var randomid = 0;
                    if (hierarchyObj != null) {
                        //for each enterprise, push a new node.
                        angular.forEach(hierarchyObj.Enterprises, function (enterprise, key) {
                            tooltip = "Name: " + enterprise.Name + "\nDescription: " + enterprise.Description;
                            var firstLevelNode = new NodeObj(enterprise.Id, "Enterprise: " + enterprise.Name, tooltip);
                            angular.forEach(enterprise.Sites, function (site, key) {
                                tooltip = "Name: " + site.Name + "\nDescription: " + site.Description + "\nAddress: " + site.Street + " " + site.City;
                                var secondLevelNode = new NodeObj(site.Id, "Site: " + site.Name, tooltip);
                                angular.forEach(site.Users, function (user, key) {
                                    tooltip = "Name: " + user.FirstName + " " + user.LastName + "\nEmail: " + user.Email + "\nCell: " + user.Cell;
                                    var thirdLevelNode = new NodeObj(user.Id, "User: " + user.Email, tooltip);
                                    angular.forEach(user.Devices, function (device, key) {
                                        tooltip = "Name: " + device.Name + "\nDevice Type: " + device.Type + "\nDescription: " + device.Description + "\nAddress: " + device.Street + " " + device.City;
                                        var fourthLevelNode = new NodeObj(device.Name, "Device: " + device.Name, tooltip);
                                        angular.forEach(device.Alerts, function (alert, key) {
                                            tooltip = "Description: " + alert.Description + ", because " + alert.Parameter + " = " + alert.Value + "\nSeverity is " + alert.Severity + ". " + alert.Message;
                                            var fifthLevelNode = new NodeObj(alert.Id, "Alert: " + alert.Description, tooltip);
                                            fourthLevelNode.nodes.push(fifthLevelNode);
                                        });
                                        thirdLevelNode.nodes.push(fourthLevelNode);
                                    });
                                    secondLevelNode.nodes.push(thirdLevelNode);
                                });
                                firstLevelNode.nodes.push(secondLevelNode);
                            })
                            tree.push(firstLevelNode);
                        });
                        angular.forEach(hierarchyObj.DeviceTypes, function (deviceType, key) {
                            tooltip = "Name: " + deviceType.Name + "\nParameters:";
                            angular.forEach(deviceType.ParamList, function (param, key) {
                                tooltip += "\n   -" + param.Name;
                            });
                            tooltip.slice(0, -2); // take off last comma and space.
                            var deviceTypeNode = new NodeObj(randomid++, "Device Type: " + deviceType.Name, tooltip);
                            tree.push(deviceTypeNode);
                        });
                        angular.forEach(hierarchyObj.EventTypes, function (eventType, key) {
                            tooltip = "Name: " + eventType.Name + "\nDevice Type: " + eventType.DeviceType + "\nNumber of Events to Generate: " + eventType.NumEvents + "\nParameters: ";
                            angular.forEach(eventType.ParamList, function (param, key) {
                                tooltip += "\n   -" + param.FriendlyName;
                            });
                            tooltip.slice(0, -2); // take off last comma and space.
                            var eventTypeNode = new NodeObj(randomid++, "Event Type: " + eventType.Name, tooltip);
                            tree.push(eventTypeNode);
                        })
                        return tree;
                    }
                },

                /** GETTERS **/
                GetAllEnterprises: GetAllEnterprises,
                GetAllSites: GetAllSites,
                GetAllUsers: GetAllUsers,
                GetAllDeviceTypes: GetAllDeviceTypes,
                GetAllDevices: GetAllDevices,
                GetAllParams: GetAllParams,
                GetParamsForDeviceType: GetParamsForDeviceType,
                GetComponentByTypeAndName: GetComponentByTypeAndName
            };
        }]);
})();