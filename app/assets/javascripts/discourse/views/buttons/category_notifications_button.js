/**
  A button for favoriting a topic

  @class CategoryNotificationsButton
  @extends Discourse.DropdownButtonView
  @namespace Discourse
  @module Discourse
**/
Discourse.CategoryNotificationsButton = Discourse.DropdownButtonView.extend({
  title: I18n.t('topic.notifications.title'),
  longDescriptionBinding: 'topic.details.notificationReasonText',
  topic: Em.computed.alias('controller.model'),
  hidden: Em.computed.alias('topic.deleted'),

  dropDownContent: [
    [Discourse.Topic.NotificationLevel.WATCHING, 'topic.notifications.watching'],
    [Discourse.Topic.NotificationLevel.TRACKING, 'topic.notifications.tracking'],
    [Discourse.Topic.NotificationLevel.REGULAR, 'topic.notifications.regular'],
    [Discourse.Topic.NotificationLevel.MUTE, 'topic.notifications.muted']
  ],

  text: function() {
    var key = (function() {
      console.log(this);
      switch (this.get('model.notification_level')) {
        case Discourse.Topic.NotificationLevel.WATCHING: return 'watching';
        case Discourse.Topic.NotificationLevel.TRACKING: return 'tracking';
        case Discourse.Topic.NotificationLevel.REGULAR: return 'regular';
        case Discourse.Topic.NotificationLevel.MUTE: return 'muted';
      }
    }).call(this);

    var icon = (function() {
      switch (key) {
        case 'watching': return '<i class="icon-circle heatmap-high"></i>&nbsp;';
        case 'tracking': return '<i class="icon-circle heatmap-low"></i>&nbsp;';
        case 'regular': return '';
        case 'muted': return '<i class="icon-remove-sign"></i>&nbsp;';
      }
    })();
    return icon + (I18n.t("topic.notifications." + key + ".title")) + "<span class='caret'></span>";
  }.property('model.notification_level'),

  clicked: function(id) {
    return this.get('model').updateNotifications(id);
  }

});

