Router.configure({
  notFoundTemplate: 'notFound',
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function () {

  this.route('calendar', {
    path: '/', 
    template: 'start',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
      return [Meteor.subscribe("eventsForUser")];
    }
  });

  this.route('profile', {
    path: '/profile/:id', 
    template: 'profile',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
      Session.set("selectedUserId", this.params.id);
      return [Meteor.subscribe("userProfile", Session.get("selectedUserId")),
        Meteor.subscribe("userAvatar", Session.get("selectedUserId"))];
    }
  });

  this.route('regions', {
    path: '/regions', 
    template: 'regions',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
      return [Meteor.subscribe("regions")];
    }
  });

  this.route('eventtypes', {
    path: '/eventtypes', 
    template: 'eventtypes',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
      return [Meteor.subscribe("eventtypes")];
    }
  });

  this.route('sports', {
    path: '/sports', 
    template: 'sports',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
      return [Meteor.subscribe("sports")];
    }
  });

  this.route('sportfederations', {
    path: '/sport/:id/federations', 
    template: 'sportfederations',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
      Session.set("selectedSportId", this.params.id);
      return [Meteor.subscribe("federationsInSport", Session.get("selectedSportId"))];
    }
  });

  this.route('federation', {
    path: '/sport/:sportId/federation/:federationId', 
    template: 'federation',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
      Session.set("selectedSportId", this.params.sportId);
      Session.set("selectedFederationId", this.params.federationId);
      return [Meteor.subscribe("federation", Session.get("selectedFederationId"))];
    }
  });

});

if (Meteor.isClient) {
  Router.onBeforeAction(function() {
    if (! Meteor.userId()) {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate);
      } else {
        this.render('notSign');
      }
    } else {
      this.next();
    }
  });
}