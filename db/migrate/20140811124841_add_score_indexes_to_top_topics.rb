class AddScoreIndexesToTopTopics < ActiveRecord::Migration
  def change
    add_index :top_topics, :daily_score
    add_index :top_topics, :weekly_score
    add_index :top_topics, :monthly_score
    add_index :top_topics, :yearly_score
  end
end
