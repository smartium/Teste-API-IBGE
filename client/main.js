import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.body.onCreated(function bodyOnCreated() {
  chosenName = new ReactiveVar('');
});

Template.body.onRendered(function bodyOnRendered() {
  document.getElementById('name').focus();
});

Template.body.helpers({
  chosenName() {
    return chosenName.get();
  }
});

Template.body.events({
  'submit form'(e) {
    e.preventDefault();
    theName = e.target.name.value;
    Meteor.call('searchName', theName, (error, result)=> {
      if (error) {
        console.log(error);

      }
      else {
        chosenName.set(result);
      }
    });
    e.target.name.value = '';
  }
});

Template.stats.onCreated(function statsOnCreated() {
  Meteor.subscribe('searchLogPublication');
});

Template.stats.helpers({
  totalSearchs() {
    return SearchLog.find().count();
  },

  searchLogs() {
    var searchResult = [];
    var searchs = SearchLog.find().fetch();
    var groupedNames = _.groupBy(_.pluck(searchs, 'name'));
    _.each(_.values(groupedNames), function(names) {
      searchResult.push({
        name: names[0],
        total: names.length
      });
    });
    console.log(searchResult);
    return searchResult;
  }
});
