class BasicCategorySerializer < ApplicationSerializer

  attributes :id,
             :name,
             :color,
             :text_color,
             :slug,
             :topic_count,
             :description,
             :topic_url,
             :hotness,
             :read_restricted,
             :notification_level,
             :permission

  def notification_level
    return 1 unless scope
    preferences = CategoryUserPreferences.where(category_id: object.id, user_id: scope.user.id).first()
    return 1 unless preferences
    preferences.notification_level
  end
end
