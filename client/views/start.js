Template.start.helpers({
    calendarOptions: {
        // Standard fullcalendar options
        height: 700,
        contentHeight: "auto",
        aspectRatio: 2,
        timezone: "local",
        //hiddenDays: [ 0 ],
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
            // Get only events from one document of the Calendars collection
            // events is a field of the Calendars collection document
            var userGroups = userIsUserInGroups(Meteor.userId());
            Events.find({$or: [{userIds: Meteor.userId()}, {adminIds: Meteor.userId()}, {groupIds: {$in: userGroups}}]}).forEach(function(event) {
                eventDetails = {
                    id: event._id,
                    title: event.type,
                    start: event.startedAt,
                    end: event.finishedAt,
                    editable: false,
                    color: green
                };
                events.push(eventDetails);
            });
            callback(events);
        },
        dayClick: function(date, jsEvent, view) {
            Session.set("selectedDate", date.toDate());
            Session.set("selectedTime", date.format("(H)"));
            Session.set("modalWindow", "modalAddEvent");
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
                console.log("user defined autorun function executed!");
            }
        ]
    },
});

Template.modalAddEvent.rendered = function() {
    $("#eventType").dropdown();
    $("#location").dropdown();
}

Template.modalAddEvent.helpers({
    'start': function() {
        return Session.get("selectedDate");
    },
    'end': function() {
        return Session.get("selectedDate");
    },
    eventTypes: function() {
        return EventTypes.find({$or: [{ownerId: null}, {ownerId: Meteor.userId()}]});
    },
    locations: function() {
        return Locations.find({ownerId: Meteor.userId()});
    }
});

Template.modalAddEvent.events({
    'click .cancel': function(e, t) {
        Session.set("modalWindow", null);
        Session.set("selectedDate", null);
        $(".modalWindow").modal("hide");
    },
    'click .eraseType': function(e, t) {
        e.preventDefault();
        $("#eventTypeNew").val("");
        return false;
    }
});