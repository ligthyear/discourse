class AddPerformanceIndexesToTopics < ActiveRecord::Migration
  def change
    add_index :topics, :created_at
    add_index :topics, :participant_count
    add_index :topics, :posts_count
    add_index :topics, :like_count
    add_index :topics, :views
  end
end
