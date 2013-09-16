class CreateCategoryUserPreferences < ActiveRecord::Migration
  def change
    create_table :category_user_preferences do |t|
      t.references :category
      t.references :user
      t.integer :notification_level

      t.timestamps
    end
    
    add_index :category_user_preferences, [:category_id, :user_id], unique: true
  end
end
