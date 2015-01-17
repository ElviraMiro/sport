Session.set("selectedDates", []);
Session.set("selectedGroups", []);
Session.set("selectedMembers", []);
Session.set("searchFrom", "fio");

var setUserFilter = _.throttle(function(template) {
    var name1 = $("#name1").val(),
        name2 = $("#name2").val(),
        name3 = $("#name3").val();
    Session.set("filter", {name1: name1, name2: name2, name3: name3});
    UserData.upsert({_id: Meteor.userId()}, {$set: {search: Session.get("filter")}});
}, 500);

Template.start.helpers({
    calendarOptions: {
        // Standard fullcalendar options
        height: 700,
        contentHeight: "auto",
        aspectRatio: 2,
        timezone: "local",
        //hiddenDays: [ 0 ],
        allDaySlot: false,
        defaultView: "agendaWeek",
        axisFormat: "HH:mm",
        slotDuration: '00:30:00',
        minTime: '07:00:00',
        maxTime: '23:00:00',
        lang: 'uk',
        // Function providing events reactive computation for fullcalendar plugin
        events: function(start, end, timezone, callback) {
            //console.log(start);
            //console.log(end);
            //console.log(timezone);
            var events = [];
            Meteor.call("setCalendarData", start.toDate(), end.toDate());
            var userGroups = userIsUserInGroups(Meteor.userId()),
                events = [];
            Events.find().forEach(function(event) {
                var type = EventTypes.findOne(event.eventTypeId),
                    location = Locations.findOne(event.locationId),
                    title = type.title;
                if (event.description) {
                    title = title + " (" + event.description + ") " + location.title;
                };
                if (event.adminIds[0] == Meteor.userId()) {
                    var color = "purple";
                } else {
                    var color = "teal";
                }
                eventDetails = {
                    id: event._id,
                    title: title,
                    start: event.startedAt,
                    end: event.finishedAt,
                    editable: false,
                    color: color
                };
                events.push(eventDetails);
            });
            callback(events);
        },
        dayClick: function(date, jsEvent, view) {
            var selDate = new Date(date.year(), date.month(), date.date(), 0, 0);
            Session.set("selectedDate", date.toDate());
            Session.set("selectedMembers", [Meteor.userId()]);
            Session.set("selectedDates", [selDate]);
            Session.set("selectedTime", date.format("(H)"));
            Session.set("modalWindow", "modalAddEvent");
            Session.set("filter", {name1: "", name2: "", name3: ""});
            $(".modalWindow").modal("show");
        },
        eventClick: function(calEvent, jsEvent, view) {
            // change the border color just for fun
            $(this).css('border-color', 'red');
        },
        // Optional: id of the calendar
        id: "calendar",
        // Optional: Additional classes to apply to the calendar
        //addedClasses: "ten wide column",
        // Optional: Additional functions to apply after each reactive events computation
        autoruns: [
            function () {
                //console.log("user defined autorun function executed!");
            }
        ]
    },
});

Template.modalAddEvent.rendered = function() {
    $("#eventType").dropdown();
    $(".time").dropdown();
    $("#location").dropdown();
    $('.ui.checkbox').checkbox();
    $('.menu .tabitem').tab();
    $(".memberFrom").dropdown();
}

Template.modalAddEvent.helpers({
    dates: function() {
        return Session.get("selectedDates");
    },
    date: function() {
        return Session.get("selectedDate");
    },
    eventTypes: function() {
        return EventTypes.find({$or: [{ownerId: null}, {ownerId: Meteor.userId()}]});
    },
    locations: function() {
        return Locations.find({ownerId: Meteor.userId()});
    },
    startHour: function() {
        var data = [];
        for (var i=7; i<23; i++) {
            if (i < 10) {
                data.push({name: "0".concat(i)});
            } else {
                data.push({name: "".concat(i)});
            }
        }
        return data;
    },
    endHour: function() {
        var data = [];
        for (var i=7; i<23; i++) {
            if (i < 10) {
                data.push({name: "0".concat(i)});
            } else {
                data.push({name: "".concat(i)});
            }
        }
        return data;
    },
    startMinute: function() {
        var data = [];
        for (var i=0; i<=55; i=i+5) {
            if (i < 10) {
                data.push({name: "0".concat(i)});
            } else {
                data.push({name: "".concat(i)});
            }
        }
        return data;
    },
    endMinute: function() {
        var data = [];
        for (var i=0; i<=55; i=i+5) {
            if (i < 10) {
                data.push({name: "0".concat(i)});
            } else {
                data.push({name: "".concat(i)});
            }
        }
        return data;
    },
    members: function() {
        return Session.get("selectedMembers");
    },
    isCurrentUser: function() {
        if (this == Meteor.userId()) {
            return true;
        } else {
            return false;
        }
    },
    isGroup: function() {
        if (Session.get("searchFrom") == "group") {
            return true;
        } else {
            return false;
        }
    },
    groups: function() {
        return Groups.find({_id: {$in: Session.get("selectedGroups")}});
    },
    users: function() {
        var result = [];
        if (Session.get("filter")) {
            result = filteredUserQuery(Session.get("filter"), Session.get("selectedMembers"));
        }
        return result;
    },
    searchGroups: function() {
        var userGroups = userIsAdminInGroups(Meteor.userId());
        return Groups.find({$and: [{_id: {$in: userGroups}},{_id: {$nin: Session.get("selectedGroups")}}]});
    }
});

Template.modalAddEvent.events({
    'click .cancel': function(e, t) {
        Session.set("modalWindow", null);
        Session.set("selectedDate", null);
        Session.set("selectedGroups", []);
        Session.set("selectedMembers", []);
        Session.set("selectedDates", []);
        UserData.upsert(Meteor.userId(), {$set: {search: null, find: null}});
        $(".modalWindow").modal("hide");
    },
    'click .eraseType': function(e, t) {
        e.preventDefault();
        $("#eventTypeNew").val("");
        return false;
    },
    'click .eraseLocation': function(e, t) {
        e.preventDefault();
        $("#locationNew").val("");
        return false;
    },
    'click .addDate': function(e, t) {
        var newDate = $("#newDate").val().split("-"),
            dates = Session.get("selectedDates"),
            date = new Date(newDate[0], (newDate[1]-1), newDate[2], 0, 0),
            add = true;
        for (var i = 0; i < dates.length; i++) {
            if (moment(dates[i]).format("DD.MM.YY") == moment(date).format("DD.MM.YY")) {
                add = false;
            }
        }
        if (add) {
            dates.push(date);
            Session.set("selectedDates", dates);
        }
    },
    'click .deleteDate': function(e, t) {
        var delDate = this,
            dates = Session.get("selectedDates"),
            newDates = [];
        for (var i = 0; i < dates.length; i++) {
            if (moment(dates[i]).format("DD.MM.YY") != moment(delDate).format("DD.MM.YY")) {
                newDates.push(dates[i]);
            }
        };
        Session.set("selectedDates", newDates);
    },
    'click .saveEvent': function(e, t) {
        var typeNew = $("#eventType input.search").val(),
            locationNew = $("#location input.search").val(),
            location = "",
            type = "";
        if (typeNew == "") {
            type = $("[name='eventType']").val();
        }
        if (locationNew == "") {
            location = $("[name='location']").val();
        }
        var eventData = {
                type: type,
                typeNew: typeNew,
                description: $("#description").val(),
                startHour: $("#startHour option:selected").val(),
                startMinute: $("#startMinute option:selected").val(),
                endHour: $("#endHour option:selected").val(),
                endMinute: $("#endMinute option:selected").val(),
                location: location,
                locationNew: locationNew
            };
        if (eventData.typeNew != "") {
            var type = EventTypes.findOne({title: eventData.typeNew});
            if (type) {
                var typeId = type._id;
            } else {
                var typeId = EventTypes.insert({
                    title: eventData.typeNew,
                    ownerId: Meteor.userId()
                });
            }
        } else {
            var typeId = eventData.type;
        }
        if (eventData.locationNew != "") {
            var location = Locations.findOne({title: eventData.locationNew});
            if (location) {
                var locationId = location._id;
            } else {
                var locationId = Locations.insert({
                    title: eventData.locationNew,
                    ownerId: Meteor.userId()
                });
            }
        } else {
            var locationId = eventData.location;
        };
        var sh = eventData.startHour,
            sm = eventData.startMinute,
            eh = eventData.endHour,
            em = eventData.endMinute;
        var dates = Session.get("selectedDates");
        for (var i=0; i < dates.length; i++) {
            var start = moment(dates[i]).add(sh, 'h'),
                start = start.add(sm, "m"),
                end = moment(dates[i]).add(eh, 'h'),
                end = end.add(em, "m");
            Events.insert({
                eventTypeId: typeId,
                locationId: locationId,
                startedAt: start.toDate(),
                finishedAt: end.toDate(),
                description: eventData.description,
                adminIds: [Meteor.userId()],
                groupIds: Session.get("selectedGroups"),
                userIds: Session.get("selectedMembers")
            });
        };
        Session.set("selectedGroups", []);
        Session.set("selectedMembers", []);
        Session.set("selectedDates", []);
        Session.set("modalWindow", null);
        Session.set("selectedDate", null);
        UserData.upsert(Meteor.userId(), {$set: {search: null, find: null}});
        $(".modalWindow").modal("hide");
    },
    'change .memberFrom': function(e, t) {
        Session.set("searchFrom", $(".memberFrom option:selected").val());
    },
    'keyup .name': function(e, t) {
        setUserFilter(t);
    },
    'click .deleteMember': function(e, t) {
        var users = Session.get("selectedMembers"),
            del = this,
            newUsers = [];
        for (var i = 0; i < users.length; i++) {
            if (users[i] != del) {
                newUsers.push(users[i]);
            }
        }
        Session.set("selectedMembers", newUsers);
    },
    'click .addMember': function(e, t) {
        var users = Session.get("selectedMembers");
        users.push(this._id);
        UserData.upsert(Meteor.userId(), {$set: {find: users}});
        Session.set("selectedMembers", users);
    },
    'click .addGroupMember': function(e, t) {
        var groups = Session.get("selectedGroups");
        groups.push(this._id);
        Session.set("selectedGroups", groups);
    },
});