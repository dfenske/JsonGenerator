//jsonService.js
(function () {

    'use strict';

    angular.module('webApp')
        .factory('jsonService', ['$filter', 'hierarchyService', function ($filter, hierarchyService) {
            var jsonObj = {};

            var CreateJSON = function (hierarchy) {
                if (hierarchy != null) {
                    //start fresh with jsonObj
                    jsonObj = {
                        businessUserDetails: [],
                        businessUserList: [],
                        userDetails: {
                            transactionId: "ignore",
                            userRetrievedList: {
                                users: []
                            },
                            resultCode: "0"
                        },
                        deviceTypeList: [],
                        deviceDetails: [],
                        deviceList: [],
                        assetSubscription: [],
                        eventType: [],
                        samplingParametersDetails: [],
                        unitOfMeasureList: [],
                        alertDetails: [],
                        eventTraceList: []
                    };

                    var assetSubscriptionId = 130;
                    var productInstanceId = 100080;
                    var subscriptionId = 2300;
                    var messageId = 180;
                    var roleTypeId = 28;
                    angular.forEach(hierarchy.EventTypes, function (eventType, key) {
                        //EVENT TYPES
                        jsonObj.eventType.push({
                            eventType: eventType.Name,
                            devices: []
                        });
                        var paramList = [];
                        angular.forEach(eventType.ParamList, function (param, key) {
                            paramList.push({
                                parameter: param.Name,
                                preview: param.Display ? "Y" : "N",
                                pageParamName: param.FriendlyName,
                                channelId: "TABLET"
                            });
                            jsonObj.unitOfMeasureList.push({
                                deviceType: eventType.DeviceType,
                                enterprise: 0,
                                eventType: eventType.Name,
                                parameter: param.Name,
                                tenant: 0,
                                unitOfMeasure: param.Unit
                            })
                        })
                        jsonObj.samplingParametersDetails.push({
                            deviceType: eventType.DeviceType,
                            enterprise: 0,
                            eventType: eventType.Name,
                            pageParameters: paramList
                        });
                    });
                    angular.forEach(hierarchy.Enterprises, function (ent, key) {
                        //ENTERPRISES
                        jsonObj.businessUserDetails.push({
                            businessUserId: ent.Id,
                            name: ent.Name,
                            description: ent.Description,
                            parentBusinessUserId: 2001,
                            statusId: 1,
                            profileId: 2,
                            profileName: "Enterprise",
                            parentType: "Organization"
                        });
                        jsonObj.businessUserList.push({
                            businessUserId: ent.Id,
                            name: ent.Name,
                            description: ent.Description,
                            parentBusinessUserId: 2001,
                            statusId: 1,
                            profileId: 2
                        });
                        angular.forEach(ent.Sites, function (site, key) {
                            //SITES
                            jsonObj.businessUserDetails.push({
                                businessUserId: site.Id,
                                name: site.Name,
                                description: site.Description,
                                parentBusinessUserId: ent.Id,
                                statusId: 1,
                                profileId: 9,
                                profileName: "Site",
                                parentType: "Enterprise",
                                businessUserAttributeList: {
                                    attributeValues: [{
                                        attributeId: 49,
                                        attributeName: "city",
                                        attributeValue: site.City,
                                        languageId: 2,
                                        statusId: 1
                                    },
                                    {
                                        attributeId: 50,
                                        attributeName: "zipCode",
                                        attributeValue: site.Zip + "", //string
                                        languageId: 2,
                                        statusId: 1
                                    },
                                    {
                                        attributeId: 51,
                                        attributeName: "business name",
                                        attributeValue: ent.Name,
                                        languageId: 2,
                                        statusId: 1
                                    },
                                    {
                                        attributeId: 103,
                                        attributeName: "latitude",
                                        attributeValue: site.Lat, //double
                                        languageId: 2,
                                        statusId: 1
                                    },
                                    {
                                        attributeId: 104,
                                        attributeName: "longitude",
                                        attributeValue: site.Long, //double
                                        languageId: 2,
                                        statusId: 1
                                    },
                                    {
                                        attributeId: 108,
                                        attributeName: "address",
                                        attributeValue: site.Street, //double
                                        languageId: 2,
                                        statusId: 1
                                    }
                                    ]
                                }
                            });
                            jsonObj.businessUserList.push({
                                businessUserId: site.Id,
                                name: site.Name,
                                description: site.Description,
                                parentBusinessUserId: ent.Id,
                                statusId: 1,
                                profileId: 9
                            });
                            angular.forEach(site.Users, function (user, key) {
                                //USERS
                                jsonObj.userDetails.userRetrievedList.users.push({
                                    id: user.Id,
                                    description: "camadmin@demo.com",
                                    parentBusinessUserId: site.Id + "", //string
                                    statusId: 1,
                                    roleTypeId: roleTypeId++,
                                    defaultLanguageId: 2,
                                    userExternalIdList: {
                                        externalIds: [
                                          {
                                              externalId: "camadmin@demo.com",
                                              defaultFlag: 1,
                                              type: "email",
                                              statusId: 1
                                          }
                                        ]
                                    },
                                    userAttributeList: {
                                        attributeValues: [
                                            {
                                                attributeId: 9,
                                                attributeName: "name",
                                                attributeValue: user.FirstName,
                                                languageId: 2,
                                                languageName: "en",
                                                statusId: 1,
                                                statusName: "active"
                                            },
                                            {
                                                attributeId: 10,
                                                attributeName: "surname",
                                                attributeValue: user.LastName,
                                                languageId: 2,
                                                languageName: "en",
                                                statusId: 1,
                                                statusName: "active"
                                            },
                                            {
                                                attributeId: 13,
                                                attributeName: "mobile",
                                                attributeValue: user.Cell,
                                                languageId: 2,
                                                languageName: "en",
                                                statusId: 1,
                                                statusName: "active"
                                            },
                                            {
                                                attributeId: 14,
                                                attributeName: "email",
                                                attributeValue: user.Email,
                                                languageId: 2,
                                                languageName: "en",
                                                statusId: 1,
                                                statusName: "active"
                                            }
                                        ]
                                    }
                                });
                                angular.forEach(user.Devices, function (device, key) {
                                    //DEVICES
                                    var allParams = [
                                        {
                                            name: "Supervisor",
                                            value: user.Id + "" //string
                                        },
                                        {
                                            name: "PositionLatitude",
                                            value: device.Lat
                                        },
                                        {
                                            name: "PositionLongitude",
                                            value: device.Long
                                        },
                                        {
                                            name: "PositionDescription",
                                            value: device.Street + " " + device.City + " " + device.Zip
                                        },
                                        {
                                            name: "Status",
                                            value: device.Status
                                        },
                                        {
                                            name: "Description",
                                            value: device.Description
                                        },
                                        {
                                            name: "Brand",
                                            value: device.Brand
                                        },
                                        {
                                            name: "Model",
                                            value: device.Model
                                        }
                                    ];
                                    // Add device-type-specific params too
                                    angular.forEach(device.TypeParams, function (param, key) {
                                        allParams.push({
                                            name: param.Name,
                                            value: param.Value
                                        })
                                    });
                                    jsonObj.deviceDetails.push({
                                        idDevice: device.Name,
                                        deviceStatus: (device.Status == 1 ? 'ACTIVE' : 'INACTIVE'),
                                        deviceType: device.Type,
                                        enterprise: site.Id + "", //string
                                        tenant: "2",
                                        parameters: allParams,
                                        channels: [],
                                        activationDate: "2016-06-20T13:13:07.000+0000"
                                    });
                                    jsonObj.deviceList.push({
                                        deviceId: device.Name,
                                        deviceStatus: (device.Status == 1 ? 'ACTIVE' : 'INACTIVE'),
                                        deviceType: device.Type,
                                        enterprise: site.Id + "", //string
                                        tenant: "2",
                                        //TODO figure out typeParams for each device
                                        parameters: [
                                            {
                                                name: "Supervisor",
                                                value: user.Id + "" //string
                                            },
                                            {
                                                name: "PositionLatitude",
                                                value: device.Lat
                                            },
                                            {
                                                name: "PositionLongitude",
                                                value: device.Long
                                            },
                                            {
                                                name: "PositionDescription",
                                                value: device.Street + " " + device.City + " " + device.Zip
                                            },
                                            {
                                                name: "Status",
                                                value: device.Status
                                            },
                                            {
                                                name: "Description",
                                                value: device.Description
                                            },
                                            {
                                                name: "Brand",
                                                value: device.Brand
                                            },
                                            {
                                                name: "Model",
                                                value: device.Model
                                            }
                                        ],
                                        activationDate: "2016-06-20T13:13:07.000+0000"
                                    });
                                    jsonObj.assetSubscription.push({ //all these numbers are not strings
                                        assetId: device.Name,
                                        assetType: device.Type,
                                        enterpriseId: ent.Id,
                                        id: assetSubscriptionId++,
                                        productId: 6,
                                        productInstanceId: productInstanceId++,
                                        productInstanceName: site.Name,
                                        productName: site.Name,
                                        provisionedBuId: site.Id,
                                        siteId: site.Id,
                                        subscriptionId: subscriptionId++,
                                        subscriptionStartDate: "2015-11-12T14:54:07Z",
                                        subscriptionStatus: 1,
                                        subscriptionType: "Selling",
                                        tenant: 2
                                    });
                                    //EVENTS FOR THE DEVICES
                                    angular.forEach(hierarchy.EventTypes, function (eventType, key) {
                                        if (eventType.DeviceType == device.Type) {
                                            var eventArray = [];
                                            var time = 0;
                                            for (var i = 0; i < eventType.NumEvents; i++) {
                                                var paramArray = [];
                                                angular.forEach(eventType.ParamList, function (param, key) {
                                                    // GENERATE AN EVENT
                                                    if (param.Num) {
                                                        paramArray.push({
                                                            name: param.Name,
                                                            value: Math.floor((Math.random() * 100) + 1)
                                                        })
                                                    } else {
                                                        paramArray.push({
                                                            name: param.Name,
                                                            value: '-'
                                                        })
                                                    }
                                                });
                                                // Add date parameters too
                                                paramArray.push({
                                                    name: "device_date",
                                                    value: "2016-06-27T00:" + ConvertToTwoDigitString(time) + ":00Z"
                                                });
                                                paramArray.push({
                                                    name: "system_date",
                                                    value: "2016-06-27T00:" + ConvertToTwoDigitString(time) + ":00Z"
                                                });
                                                paramArray.push({
                                                    name: "id",
                                                    value: "1"
                                                });
                                                eventArray.push({
                                                    parameters: paramArray
                                                });
                                                time++;
                                            }
                                            $filter("filter")(jsonObj.eventType, { eventType: eventType.Name })[0].devices.push({
                                                deviceId: device.Name,
                                                deviceType: device.Type,
                                                arrayOfDetails: eventArray
                                            })
                                            if ($filter("filter")(jsonObj.eventType, { eventType: eventType.Name })[0].totalItem == null) {
                                                $filter("filter")(jsonObj.eventType, { eventType: eventType.Name })[0].totalItem = eventType.NumEvents;
                                            } else {
                                                $filter("filter")(jsonObj.eventType, { eventType: eventType.Name })[0].totalItem += eventType.NumEvents;
                                            }
                                        }
                                    });
                                    angular.forEach(device.Alerts, function (alert, key) {
                                        //ALERTS
                                        jsonObj.alertDetails.push({
                                            eventTrace: {
                                                alertType: "AUTOMATIC",
                                                assetDeviceId: device.Name,
                                                assetDeviceType: device.Type,
                                                count: 1,
                                                creationDate: "2016-06-29T17:30:05Z",
                                                description: alert.Description,
                                                enterpriseId: ent.Id,
                                                eventDate: "2016-06-29T17:30:05Z",
                                                eventDetails: {
                                                    parameter: alert.Parameter,
                                                    value: alert.Value,
                                                    creationDate: "2016-06-29T17:30:05Z"
                                                },
                                                eventId: alert.Id,
                                                monitoringType: "CONDITION_BASED",
                                                provisionedBuId: site.Id,
                                                severity: alert.Severity,
                                                siteId: site.Id,
                                                status: 1,
                                                updateDate: "1970-01-01T00:00:00Z"
                                            },
                                            messageRecipientList: [
                                                {
                                                    ack: false,
                                                    creationDate: "2016-06-29T17:30:05Z",
                                                    eventId: alert.Id,
                                                    id: messageId++,
                                                    lastUpdateDate: "2016-06-29T17:30:05Z",
                                                    messageType: "EMAIL",
                                                    read: false,
                                                    recipient: user.Email,
                                                    recipientUsername: "camadmin@demo.com",
                                                    textMessage: alert.Message
                                                },
                                                {
                                                    ack: false,
                                                    creationDate: "2016-06-29T17:30:05Z",
                                                    eventId: alert.Id,
                                                    id: messageId++,
                                                    lastUpdateDate: "2016-06-29T17:30:05Z",
                                                    messageType: "SMS",
                                                    read: false,
                                                    recipient: user.Cell,
                                                    recipientUsername: "camadmin@demo.com",
                                                    textMessage: alert.Message
                                                }
                                            ],
                                            resultCode: 0,
                                            transactionId: 12345
                                        });
                                        jsonObj.eventTraceList.push({
                                            alertType: "AUTOMATIC",
                                            assetDeviceId: device.Name,
                                            assetDeviceType: device.Type,
                                            count: 1,
                                            creationDate: "2016-06-29T17:30:05Z",
                                            description: alert.Description,
                                            enterpriseId: ent.Id,
                                            eventDate: "2016-06-29T17:30:05Z",
                                            eventId: alert.Id,
                                            monitoringType: "CONDITION_BASED",
                                            provisionedBuId: site.Id,
                                            severity: alert.Severity,
                                            siteId: site.Id,
                                            status: 1,
                                            updateDate: "1970-01-01T00:00:00Z"
                                        });
                                    });
                                });
                            });
                        });
                    });
                    angular.forEach(hierarchy.DeviceTypes, function (deviceType, key) {
                        //DEVICE TYPES
                        jsonObj.deviceTypeList.push({
                            deviceTypeId: deviceType.Name,
                            deviceTypeDescription: deviceType.Name
                        });
                    })
                }
                return jsonObj;
            };

            var ConvertToTwoDigitString = function (num) {
                if (num < 10) {
                    return "0" + num;
                } else if (num > 99) {
                    return "" + (num % 10);
                } else {
                    return "" + num;
                }
            };

            return {
                jsonObj: jsonObj,
                CreateJSON: CreateJSON
            }
        }]);
})();