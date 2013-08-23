class AddTrackAllTopicsToUser < ActiveRecord::Migration
  def change
    add_column :users, :track_all_topics, :boolean
  end
end
