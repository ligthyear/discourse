class ArchetypeSerializer < ApplicationSerializer

  attributes :id, :name, :slug, :options

  def options
    object.options.keys.collect do |k|
      {
        key: k,
        title: I18n.t("archetypes.#{object.id}.options.#{k}.title"),
        description: I18n.t("archetypes.#{object.id}.options.#{k}.description"),
        option_type: object.options[k]
      }
    end
  end

  def name
    I18n.t("archetypes.#{object.id}.title")
  end

  def slug
    begin
      SiteSetting.send("archetypes.#{object.id}.slug") || object.id
    rescue NoMethodError
      object.id
    end
  end

end
