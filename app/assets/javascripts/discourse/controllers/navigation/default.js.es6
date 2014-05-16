/**
  Handles the controller for the default navigation within discovery.

  @class NavigationDefaultController
  @extends Discourse.Controller
  @namespace Discourse
  @module Discourse
**/
export default Discourse.Controller.extend({
  categories: function() {
    return Discourse.Category.list();
  }.property('archetype'),

  navItems: function() {
    var args = {};
    if (this.get("archetype")){
      args.archetype = this.get("archetype");
    }
    return Discourse.NavItem.buildList('', args);
  }.property('archetype')
});
