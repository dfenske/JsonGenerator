//componentController.js
(function () {
    'use strict';

    angular.module('webApp')
        .controller('componentController', ['$scope', '$rootScope', '$filter', '$localStorage', '$window', '$timeout', 'hierarchyService', 'Geocode',
            function ($scope, $rootScope, $filter, $localStorage, $window, $timeout, hierarchyService, Geocode) {

                /** SCOPE VARIABLES **/
                $scope.tabs = [
                    {
                        title: 'Enterprise',
                        template: 'views/partials/enterpriseForm.html',
                        disabled: false
                    },
                    {
                        title: 'Site',
                        template: 'views/partials/siteForm.html',
                        disabled: true
                    },
                    {
                        title: 'User',
                        template: 'views/partials/userForm.html',
                        disabled: true
                    },
                    {
                        title: 'Device Type',
                        template: 'views/partials/deviceTypeForm.html',
                        disabled: true
                    },
                    {
                        title: 'Device',
                        template: 'views/partials/deviceForm.html',
                        disabled: true
                    },
                    {
                        title: 'Event Type',
                        template: 'views/partials/eventTypeForm.html',
                        disabled: true
                    },
                    {
                        title: 'Alert',
                        template: 'views/partials/alertForm.html',
                        disabled: true
                    }
                ]
                $scope.map = { center: { latitude: 47.610376, longitude: -122.341853 }, zoom: 11 };
                $scope.marker = {
                    id: 0,
                    coords: {
                        latitude: 47.610376,
                        longitude: -122.341853
                    }
                };
                $scope.forms = {};

                // This is to workaround a bug in Google Maps - the map only loads if window's resized when it exists within a template. Therefore, trigger a resize event.
                $scope.resizeMap = function () {
                    $timeout(function () {
                        var evt = $window.document.createEvent('UIEvents');
                        evt.initUIEvent('resize', true, false, $window, 0);
                        $window.dispatchEvent(evt);
                    }, 1000);
                };

                /** FORM PROPERTIES INITIALIZATION **/
                $scope.enterpriseProps = [
                    {
                        Name: "EnterpriseName",
                        Label: "Enterprise Name",
                        Type: "text",
                        ErrorMessage: "Required Field.",
                        Value: '',
                        Tooltip: "The name of the enterprise.",
                        IsValid: true,
                        MinLength: 4,
                        MaxLength: 20,
                        Required: true
                        //Pattern: '[a-zA-Z0-9]*'
                    },
                    {
                        Name: "EnterpriseDescription",
                        Label: "Description",
                        Type: "text",
                        ErrorMessage: "Required Field.",
                        Value: '',
                        Tooltip: "The description of the enterprise.",
                        IsValid: true,
                        MinLength: 4,
                        MaxLength: 20,
                        Required: true
                    }
                ];
                $scope.siteProps = [
                {
                    Name: "SiteName",
                    Label: "Site Name",
                    Type: "text",
                    ErrorMessage: "Required Field.",
                    Value: '',
                    Tooltip: "The name of the site.",
                    IsValid: true,
                    MinLength: 4,
                    MaxLength: 20,
                    Required: true
                },
                {
                    Name: "SiteDescription",
                    Label: "Description",
                    Type: "text",
                    ErrorMessage: "Required Field.",
                    Value: '',
                    Tooltip: "The description of the site.",
                    IsValid: true,
                    MinLength: 4,
                    MaxLength: 20,
                    Required: true
                },
                {
                    Name: "SiteParentUserName",
                    Label: "Enterprise",
                    Type: "text",
                    ErrorMessage: "Required Field",
                    Options: [],
                    Value: '',
                    Tooltip: "The enterprise that this site belongs to.",
                    IsValid: true,
                    Required: true
                },
                {
                    Name: "Map",
                    Label: "Address",
                    Value: '',
                    City: '',
                    Street: '',
                    ZipCode: '',
                    Lat: '',
                    Long: '',
                    Tooltip: "The location information about this site.",
                    ErrorMessage: 'Enter address and click "Show on Map"',
                    IsValid: true,
                    Required: true
                }
                ];
                $scope.userProps = [
                    {
                        Name: "UserDescription",
                        Label: "E-mail",
                        Type: "email",
                        ErrorMessage: "Must be a valid email.",
                        Value: '',
                        Tooltip: "The email for this user.",
                        IsValid: true,
                        MinLength: 4,
                        MaxLength: 40,
                        Required: true
                    },
                    {
                        Name: "UserParentName",
                        Label: "Parent Name",
                        Type: "text",
                        ErrorMessage: "Required Field.",
                        Options: [],
                        Value: '',
                        Tooltip: "The business user that this user belongs to.",
                        IsValid: true,
                        Required: true
                    },
                    {
                        Name: "UserFirstName",
                        Label: "First Name",
                        Type: "text",
                        ErrorMessage: "Required Field.",
                        Value: '',
                        Tooltip: "The first name of the user.",
                        IsValid: true,
                        MinLength: 2,
                        MaxLength: 20,
                        Required: true,
                        Pattern: '[a-zA-Z0-9]*'
                    },
                    {
                        Name: "UserLastName",
                        Label: "Last Name",
                        Type: "text",
                        ErrorMessage: "Required Field.",
                        Value: '',
                        Tooltip: "The last name of the user.",
                        IsValid: true,
                        MinLength: 2,
                        MaxLength: 20,
                        Required: true,
                        Pattern: '[a-zA-Z0-9]*'
                    },
                    {
                        Name: "UserMobile",
                        Label: "Cell Number",
                        Type: "tel",
                        ErrorMessage: "Must be a valid phone number.",
                        Value: '',
                        Tooltip: "The cell number of the user.",
                        IsValid: true,
                        Required: true
                    }
                ];
                $scope.deviceTypeProps = [
                    {
                        Name: "DeviceTypeName",
                        Label: "Name",
                        Type: "text",
                        ErrorMessage: "Required Field.",
                        Value: '',
                        Tooltip: "The type of device.",
                        IsValid: true,
                        MinLength: 4,
                        MaxLength: 20,
                        Required: true,
                        Pattern: '[a-zA-Z0-9_-]*'
                    },
                    {
                        Name: "DeviceTypeParams",
                        Label: "Properties",
                        Type: "dynamicList",
                        ErrorMessage: "Required Field.",
                        Value: '',
                        Tooltip: "The list of properties for this device type",
                        IsValid: true,
                        Pattern: '[a-zA-Z0-9]*',
                        Required: true,
                        ParamArray: [{
                            Id: 0,
                            TagId: "param0",
                            Name: "",
                            Type: ""
                        }]
                    }
                ];
                $scope.deviceProps = [
                    {
                        Name: "DeviceID",
                        Label: "Name",
                        Type: "text",
                        ErrorMessage: "Required, must have no spaces.",
                        Value: '',
                        Tooltip: "The name of the device (no spaces allowed).",
                        IsValid: true,
                        MinLength: 4,
                        MaxLength: 20,
                        Required: true,
                        Pattern: '[a-zA-Z0-9_-]*'
                    },
                    {
                        Name: "DeviceType",
                        Label: "Device Type",
                        Type: "text",
                        ErrorMessage: "Required Field.",
                        Options: [],
                        Value: '',
                        Tooltip: "The type of the device.",
                        IsValid: true,
                        Required: true
                    },
                    {
                        Name: "DeviceTypeParams",
                        Label: "Properties of the Device Type",
                        Type: "dynamic",
                        ErrorMessage: "Required Field.",
                        Tooltip: "The properties of this selected device type.",
                        ParamArray: [],
                        Required: true
                    },
                    {
                        Name: "DeviceSupervisor",
                        Label: "Supervisor",
                        Type: "text",
                        ErrorMessage: "Required Field.",
                        Options: [],
                        Value: '',
                        Tooltip: "The user that the device belongs to.",
                        IsValid: true,
                        Required: true
                    },
                    {
                        Name: "DeviceBrand",
                        Label: "Brand",
                        Type: "text",
                        ErrorMessage: "Required Field.",
                        Value: '',
                        Tooltip: "The brand of the device.",
                        IsValid: true,
                        Required: true
                    },
                    {
                        Name: "DeviceModel",
                        Label: "Model",
                        Type: "text",
                        ErrorMessage: "Required Field.",
                        Value: '',
                        Tooltip: "The model of the device.",
                        IsValid: true,
                        Required: true
                    },
                    {
                        Name: "DeviceDescription",
                        Label: "Description",
                        Type: "text",
                        ErrorMessage: "Required Field.",
                        Value: '',
                        Tooltip: "A description of the device.",
                        IsValid: true,
                        Required: true
                    },
                    {
                        Name: "DeviceStatus",
                        Label: "Status",
                        Type: "text",
                        ErrorMessage: "Required Field.",
                        Value: '1',
                        Tooltip: "The status of the device.",
                        Options: [{
                            Value: '1',
                            Name: 'Available',
                            Selected: true
                        }, {
                            Value: '0',
                            Name: 'Unavailable',
                            Selected: false
                        }],
                        IsValid: true,
                        Required: true
                    },
                    {
                        Name: "Map",
                        Label: "Address",
                        City: '',
                        Addr: '',
                        Street: '',
                        ZipCode: '',
                        Lat: '',
                        Long: '',
                        Tooltip: "The location information about this site.",
                        ErrorMessage: 'Enter address and click "Show on Map"',
                        IsValid: true,
                        Required: true
                    }
                ];
                $scope.eventTypeProps = [
                {
                    Name: "EventTypeName",
                    Label: "Name (no spaces)",
                    Type: "text",
                    ErrorMessage: "Required, must have no spaces.",
                    Value: '',
                    Tooltip: "The name of the event type (no spaces allowed).",
                    IsValid: true,
                    Pattern: '[a-zA-Z0-9]*',
                    Required: true
                },
                {
                    Name: "EventDeviceType",
                    Label: "Device Type",
                    Type: "text",
                    ErrorMessage: "Make sure you have created a device of this type.",
                    Options: [],
                    Value: '',
                    Tooltip: "The device type that sends this type of event.",
                    IsValid: true
                },
                {
                    Name: "NumEvents",
                    Label: "Number of Events to Generate",
                    Type: "number",
                    ErrorMessage: "Required, must be a number.",
                    Value: '',
                    Tooltip: "The number of events you want to generate per device.",
                    IsValid: true,
                    Required: true
                },
                {
                    Name: "EventTypeParams",
                    Label: "Parameter List",
                    Type: "dynamicList",
                    ErrorMessage: "Required Field.",
                    Value: '',
                    Tooltip: "The list of properties for this device type",
                    IsValid: true,
                    Pattern: '[a-zA-Z0-9]*',
                    ParamArray: [{
                        Id: 0,
                        TagId: "param0",
                        Name: "",
                        FriendlyName: "",
                        Unit: '',
                        Num: true,
                        Display: true
                    }]
                }
                ];
                $scope.alertProps = [
                {
                    Name: "AlertDeviceID",
                    Label: "Device Name",
                    Type: "text",
                    ErrorMessage: "Required Field.",
                    Options: [],
                    Value: '',
                    Tooltip: "The Device that has the alert.",
                    IsValid: true,
                    Required: true
                },
                {
                    Name: "AlertDescription",
                    Label: "Description",
                    Type: "text",
                    ErrorMessage: "Required Field.",
                    Value: '',
                    Tooltip: "The alert description.",
                    IsValid: true,
                    Required: true
                },
                {
                    Name: "AlertParameter",
                    Label: "Parameter",
                    Type: "text",
                    ErrorMessage: "Required Field.",
                    Options: [],
                    Value: '',
                    Tooltip: "The parameter that triggered the alert",
                    IsValid: true,
                    Required: true
                },
                {
                    Name: "AlertValue",
                    Label: "Value",
                    Type: "text",
                    ErrorMessage: "Required Field.",
                    Value: '',
                    Tooltip: "The value of the parameter that triggered the alert.",
                    IsValid: true,
                    Required: true
                },
                {
                    Name: "AlertSeverity",
                    Label: "Severity",
                    Type: "text",
                    ErrorMessage: "Required Field.",
                    Value: 'LOW',
                    Tooltip: "The severity of the alert.",
                    Options: [
                        {
                            Value: "LOW",
                            Name: "LOW",
                            Selected: true
                        },
                        {
                            Value: "MEDIUM",
                            Name: "MEDIUM",
                            Selected: false
                        },
                        {
                            Value: "HIGH",
                            Name: "HIGH",
                            Selected: false
                        }
                    ],
                    IsValid: true,
                    Required: true
                },
                {
                    Name: "AlertMessage",
                    Label: "Text Message",
                    Type: "text",
                    ErrorMessage: "Required Field.",
                    Value: '',
                    Tooltip: "The message sent to recipients about alert.",
                    IsValid: true,
                    Required: true
                }
                ];

                $scope.updateMap = function (component) {
                    if (component == 'Site') {
                        Geocode.geocode($filter("filter")($scope.siteProps, { Name: 'Map' })[0].Value)
                       .then(function (data) {
                           // Once promise returns geocoded data, 
                           // $scope.map will update and display the map on the view
                           $scope.map = data.map;
                           $scope.marker = data.marker;
                           $filter("filter")($scope.siteProps, { Name: 'Map' })[0].Lat = data.addressData.lat;
                           $filter("filter")($scope.siteProps, { Name: 'Map' })[0].Long = data.addressData.long;
                           $filter("filter")($scope.siteProps, { Name: 'Map' })[0].Street = data.addressData.address;
                           $filter("filter")($scope.siteProps, { Name: 'Map' })[0].City = data.addressData.city;
                           $filter("filter")($scope.siteProps, { Name: 'Map' })[0].ZipCode = data.addressData.zipCode;
                       });
                    }
                    else { // Device
                        Geocode.geocode($filter("filter")($scope.deviceProps, { Name: 'Map' })[0].Value)
                       .then(function (data) {
                           // Once promise returns geocoded data, 
                           // $scope.map will update and display the map on the view
                           $scope.map = data.map;
                           $scope.marker = data.marker;
                           $filter("filter")($scope.deviceProps, { Name: 'Map' })[0].Lat = data.addressData.lat;
                           $filter("filter")($scope.deviceProps, { Name: 'Map' })[0].Long = data.addressData.long;
                           $filter("filter")($scope.deviceProps, { Name: 'Map' })[0].Street = data.addressData.address;
                           $filter("filter")($scope.deviceProps, { Name: 'Map' })[0].City = data.addressData.city;
                           $filter("filter")($scope.deviceProps, { Name: 'Map' })[0].ZipCode = data.addressData.zipCode;
                       });
                    }
                };

                // Get lists of options from HierarchyService
                $rootScope.$on('hierarchy-updated', function (event, data) {
                    UpdateDropdowns();
                    UpdateTabs();
                });

                // Bind selected item to form
                $rootScope.$on('item-selected', function (event, data) {
                    var arr = data.split(':');
                    var componentType = arr[0].replace(' ', '');
                    var name = arr[1].substr(1);

                    // Grab the right component from hierarchyService.
                    var component = hierarchyService.GetComponentByTypeAndName(componentType, name);

                    // Navigate to correct tab and bind to the data
                    switch (componentType) {
                        case 'Enterprise':
                            $scope.active = 1;
                            BindEnterpriseToUI(component);
                            break;
                        case 'Site':
                            $scope.active = 2;
                            BindSiteToUI(component);
                            break;
                        case 'User':
                            $scope.active = 3;
                            BindUserToUI(component);
                            break;
                        case 'DeviceType':
                            $scope.active = 4;
                            BindDeviceTypeToUI(component);
                            break;
                        case 'Device':
                            $scope.active = 5;
                            BindDeviceToUI(component);
                            break;
                        case 'EventType':
                            $scope.active = 6;
                            BindEventTypeToUI(component);
                            break;
                        case 'Alert':
                            $scope.active = 7;
                            BindAlertToUI(component);
                            break;
                        default:
                            break;
                    }
                })

                /** NAVIGATION METHODS **/
                var OrderOfPages = [
                    'Enterprise',
                    'Site',
                    'User',
                    'DeviceType',
                    'Device',
                    'EventType',
                    'Alert'
                ];

                $scope.GoToNextPage = function () {
                    $scope.active++;
                };

                $scope.GoToPrevPage = function () {
                    $scope.active--;
                }

                /** BINDING METHODS **/
                var BindEnterpriseToUI = function (enterprise) {
                    $scope.enterpriseProps[0].Value = enterprise.Name;
                    $scope.enterpriseProps[1].Value = enterprise.Description;
                }

                var BindSiteToUI = function (site) {
                    $scope.siteProps[0].Value = site.Name;
                    $scope.siteProps[1].Value = site.Description;
                    //$scope.siteProps[2].Value = site... how to get parent name?
                    $scope.siteProps[3].Value = (site.Street != null ? site.Street : '') + " " + (site.City != null ? site.City : '');
                    //TODO finish the binding method.
                }

                var BindUserToUI = function (user) {
                    $scope.userProps[0].Value = user.Email;
                    $scope.userProps[2].Value = user.FirstName;
                    $scope.userProps[3].Value = user.LastName;
                    $scope.userProps[4].Value = user.Cell;
                    //TODO finish the binding method.
                }

                var BindDeviceTypeToUI = function (deviceType) {
                    $scope.deviceTypeProps[0].Value = deviceType.Name;
                    $scope.deviceTypeProps[1].ParamArray = (deviceType.ParamList == null ? [{
                        Id: 0,
                        TagId: "param0",
                        Name: "",
                        Type: ""
                    }] : deviceType.ParamList);
                }

                var BindDeviceToUI = function (device) {
                    $scope.deviceProps[0].Value = device.Name;
                    $scope.deviceProps[1].Value = device.Type;
                    $scope.deviceProps[3].Value = device.Brand;
                    $scope.deviceProps[4].Value = device.Model;
                    $scope.deviceProps[5].Value = device.Description;
                    $scope.deviceProps[6].Value = device.Status;
                    $scope.deviceProps[7].Value = (device.Street != null ? device.Street : '') + " " + (device.City != null ? device.City : '');
                    //TODO finish the binding method.
                }

                var BindEventTypeToUI = function (eventType) {
                    $scope.eventTypeProps[0].Value = eventType.Name;
                    $scope.eventTypeProps[1].Value = eventType.DeviceType;
                    $scope.eventTypeProps[2].Value = eventType.NumEvents;
                    $scope.eventTypeProps[3].ParamArray = (eventType.ParamList == null ? [{
                        Id: 0,
                        TagId: "param0",
                        Name: "",
                        Type: ""
                    }] : eventType.ParamList);
                }

                var BindAlertToUI = function (alert) {
                    $scope.alertProps[1].Value = alert.Description;
                    $scope.alertProps[2].Value = alert.Parameter;
                    $scope.alertProps[3].Value = alert.Value;
                    $scope.alertProps[4].Value = alert.Severity;
                    $scope.alertProps[5].Value = alert.Message;
                    //TODO finish the binding method.
                }

                /** UPDATE DROPDOWN METHODS **/
                var UpdateDropdowns = function () {
                    UpdateSiteProps();
                    UpdateUserProps();
                    UpdateDeviceProps();
                    UpdateEventTypeProps();
                    UpdateAlertProps();
                }

                var UpdateSiteProps = function () {
                    var list = hierarchyService.GetAllEnterprises();
                    $filter("filter")($scope.siteProps, { Name: "SiteParentUserName" })[0].Options = list;
                    if (list.length == 0) {
                        $filter("filter")($scope.siteProps, { Name: "SiteParentUserName" })[0].Value = '';
                    } else {
                        $filter("filter")($scope.siteProps, { Name: "SiteParentUserName" })[0].Value = list[0].Value;
                    }
                }

                var UpdateUserProps = function () {
                    var list = hierarchyService.GetAllSites();
                    $filter("filter")($scope.userProps, { Name: "UserParentName" })[0].Options = list;
                    if (list.length == 0) {
                        $filter("filter")($scope.userProps, { Name: "UserParentName" })[0].Value = '';
                    } else {
                        $filter("filter")($scope.userProps, { Name: "UserParentName" })[0].Value = list[0].Value;
                    }
                }

                var UpdateDeviceProps = function () {
                    var userList = hierarchyService.GetAllUsers();
                    var deviceTypeList = hierarchyService.GetAllDeviceTypes();

                    $filter("filter")($scope.deviceProps, { Name: "DeviceType" })[0].Options = deviceTypeList;
                    $filter("filter")($scope.deviceProps, { Name: "DeviceType" })[0].Value = '';

                    $filter("filter")($scope.deviceProps, { Name: "DeviceSupervisor" })[0].Options = userList;
                    if (userList.length == 0) {
                        $filter("filter")($scope.deviceProps, { Name: "DeviceSupervisor" })[0].Value = '';
                    } else {
                        $filter("filter")($scope.deviceProps, { Name: "DeviceSupervisor" })[0].Value = userList[0].Value;
                    }
                }

                var UpdateEventTypeProps = function () {
                    var deviceTypeList = hierarchyService.GetAllDeviceTypes();
                    $filter("filter")($scope.eventTypeProps, { Name: "EventDeviceType" })[0].Options = deviceTypeList;
                    if (deviceTypeList.length == 0) {
                        $filter("filter")($scope.eventTypeProps, { Name: "EventDeviceType" })[0].Value = '';
                    } else {
                        $filter("filter")($scope.eventTypeProps, { Name: "EventDeviceType" })[0].Value = deviceTypeList[0].Value;
                    }
                }

                var UpdateAlertProps = function () {
                    var deviceList = hierarchyService.GetAllDevices();
                    $filter("filter")($scope.alertProps, { Name: "AlertDeviceID" })[0].Options = deviceList;
                    if (deviceList.length == 0) {
                        $filter("filter")($scope.alertProps, { Name: "AlertDeviceID" })[0].Value = '';
                    } else {
                        $filter("filter")($scope.alertProps, { Name: "AlertDeviceID" })[0].Value = deviceList[0].Value;
                    }
                    var paramList = hierarchyService.GetAllParams();
                    $filter("filter")($scope.alertProps, { Name: "AlertParameter" })[0].Options = paramList;
                    if (paramList.length == 0) {
                        $filter("filter")($scope.alertProps, { Name: "AlertParameter" })[0].Value = '';
                    } else {
                        $filter("filter")($scope.alertProps, { Name: "AlertParameter" })[0].Value = paramList[0].Value;
                    }
                }

                $scope.updateFromDropdown = function (type) {
                    if (IsDeviceType(type)) {
                        if (type == '') {
                            $scope.currentDeviceType = null;
                        } else {
                            $scope.currentDeviceType = type;
                            $filter("filter")($scope.deviceProps, { Name: "DeviceTypeParams" })[0].ParamArray = hierarchyService.GetParamsForDeviceType(type);
                        }
                    }
                };

                var IsDeviceType = function (type) {
                    var itIs = false;
                    angular.forEach(hierarchyService.GetAllDeviceTypes(), function (deviceType, key) {
                        if (deviceType.Name == type) {
                            itIs = true;
                        }
                    });
                    return itIs;
                }

                /** TABS **/
                var UpdateTabs = function () {
                    $filter("filter")($scope.tabs, { title: "Site" }, true)[0].disabled = hierarchyService.GetAllEnterprises().length == 0;
                    $filter("filter")($scope.tabs, { title: "User" }, true)[0].disabled = hierarchyService.GetAllSites().length == 0;
                    $filter("filter")($scope.tabs, { title: "Device Type" }, true)[0].disabled = hierarchyService.GetAllUsers().length == 0;
                    $filter("filter")($scope.tabs, { title: "Device" }, true)[0].disabled = hierarchyService.GetAllDeviceTypes().length == 0;
                    $filter("filter")($scope.tabs, { title: "Event Type" }, true)[0].disabled = hierarchyService.GetAllDevices().length == 0;
                    $filter("filter")($scope.tabs, { title: "Alert" }, true)[0].disabled = hierarchyService.GetAllParams().length == 0;
                }

                /** FORM METHODS - SAVE, DELETE, CLEAR **/
                $scope.SaveComponent = function (type, data) {
                    hierarchyService.SaveComponent(type, data);
                    $scope.ClearForm(type);
                }

                $scope.DeleteComponent = function (type, data) {
                    hierarchyService.DeleteComponent(type, data);
                    $scope.ClearForm(type);
                }

                $scope.ClearForm = function (type) {
                    // Bind an empty object to the form to clear it.
                    switch (type) {
                        case 'enterprise':
                            BindEnterpriseToUI({});
                            $scope.forms.enterpriseForm.$setPristine();
                            $scope.forms.enterpriseForm.$setUntouched();
                            break;
                        case 'site':
                            BindSiteToUI({});
                            $scope.forms.siteForm.$setPristine();
                            $scope.forms.siteForm.$setUntouched();
                            break;
                        case 'user':
                            BindUserToUI({});
                            $scope.forms.userForm.$setPristine();
                            $scope.forms.userForm.$setUntouched();
                            break;
                        case 'deviceType':
                            BindDeviceTypeToUI({});
                            $scope.forms.deviceTypeForm.$setPristine();
                            $scope.forms.deviceTypeForm.$setUntouched();
                            break;
                        case 'device':
                            BindDeviceToUI({});
                            $scope.forms.deviceForm.$setPristine();
                            $scope.forms.deviceForm.$setUntouched();
                            break;
                        case 'eventType':
                            BindEventTypeToUI({});
                            $scope.forms.eventTypeForm.$setPristine();
                            $scope.forms.eventTypeForm.$setUntouched();
                            break;
                        case 'alert':
                            BindAlertToUI({});
                            $scope.forms.alertForm.$setPristine();
                            $scope.forms.alertForm.$setUntouched();
                            break;
                        default:
                            break;
                    }
                }

                /** Dynamic Parameters **/
                $scope.addParameterInput = function (type) {
                    if (type == 'eventType') {
                        //Get current index
                        var i = 0;
                        var keepGoing = true;
                        var eventTypeParams = $filter("filter")($scope.eventTypeProps, { Name: "EventTypeParams" })[0]
                        // find max 
                        while (keepGoing) {
                            if ($filter("filter")(eventTypeParams.ParamArray, { Id: i })[0] == null) {
                                keepGoing = false;
                            } else {
                                i++;
                            }
                        }
                        // Now i is the next index.
                        eventTypeParams.ParamArray.push(
                            {
                                Id: i,
                                TagId: "param" + i,
                                Name: '',
                                FriendlyName: '',
                                Unit: '',
                                Num: true,
                                Display: true
                            });
                    } else {
                        //Get current index
                        var i = 0;
                        var keepGoing = true;
                        var deviceTypeParams = $filter("filter")($scope.deviceTypeProps, { Name: "DeviceTypeParams" })[0]
                        // find max 
                        while (keepGoing) {
                            if ($filter("filter")(deviceTypeParams.ParamArray, { Id: i })[0] == null) {
                                keepGoing = false;
                            } else {
                                i++;
                            }
                        }
                        // Now i is the next index.
                        deviceTypeParams.ParamArray.push(
                            {
                                Id: i,
                                TagId: "param" + i,
                                Name: '',
                                Type: ''
                            });
                    }
                }

                $scope.subtractParameterInput = function (type, id) {
                    if (type == 'eventType') {
                        var eventTypeParams = $filter("filter")($scope.eventTypeProps, { Name: "EventTypeParams" })[0]
                        // don't let delete first one
                        if (eventTypeParams.ParamArray.length > 1) {
                            var bool = false;
                            // go through every index starting from index we want to delete, point it to the next index.
                            for (var i = 0; i < eventTypeParams.ParamArray.length - 1; i++) {
                                // once we hit the correct id, start doing the updates.
                                if (eventTypeParams.ParamArray[i].Id == id) {
                                    bool = true;
                                }
                                if (bool == true) {
                                    eventTypeParams.ParamArray[i] = eventTypeParams.ParamArray[i + 1];
                                }
                            }
                            // at the end, delete last item
                            eventTypeParams.ParamArray.splice(eventTypeParams.ParamArray.length - 1, 1);
                        }
                    } else {
                        var deviceTypeParams = $filter("filter")($scope.deviceTypeProps, { Name: "DeviceTypeParams" })[0]
                        // don't let delete first one
                        if (deviceTypeParams.ParamArray.length > 1) {
                            var bool = false;
                            // go through every index starting from index we want to delete, point it to the next index.
                            for (var i = 0; i < deviceTypeParams.ParamArray.length - 1; i++) {
                                // once we hit the correct id, start doing the updates.
                                if (deviceTypeParams.ParamArray[i].Id == id) {
                                    bool = true;
                                }
                                if (bool == true) {
                                    deviceTypeParams.ParamArray[i] = deviceTypeParams.ParamArray[i + 1];
                                }
                            }
                            // at the end, delete last item
                            deviceTypeParams.ParamArray.splice(deviceTypeParams.ParamArray.length - 1, 1);

                        }
                    }
                }

            }]);
})();
