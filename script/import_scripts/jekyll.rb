require File.expand_path(File.dirname(__FILE__) + "/base.rb")
require "jekyll"

UPLOADS_DIR = "assets/content"
USER_ID = 24
CLEAR = true

class ImportScripts::Jekyll < ImportScripts::Base

  def initialize
    super
    @uploads = {}
  end


  def execute
    setup
    create_uploads
    clear_imports if CLEAR
    import_posts
  end

  private

    def setup
      @config = Jekyll.configuration({})
      @site = Jekyll::Site.new(@config)

      @site.read
    end

    def clear_imports
      # PostCustomField.where(name: 'import_id').pluck(:post_id).each do |post_id|
      #   post = Post.find(post_id)
      #   post.topic.delete()
      #   post._custom_fields.delete()
      #   post.delete()
      #   PostCustomField.where(post_id: post_id).delete(false)
      # end
      @existing_posts = {}
    end

    def create_uploads
      Dir.glob("#{UPLOADS_DIR}/**/**").each do |file|
        if !File.directory?(file)
          @uploads["/#{file}"] = create_upload(USER_ID, File.expand_path(file), File.basename(file))
        end
      end
    end

    def clean_up(content, image)
      content = content.gsub("{% include JB/setup %}", "").gsub("{{BASE_PATH}}", "")
      content = "![](#{image})\n#{content}" if image
      replace_urls(content)
    end

    def replace_urls(inp)
      @uploads.each do |key, val|
        inp.gsub!(key, val.url)
      end
      inp
    end

    def import_posts
      create_posts(@site.posts, {}) do |post|
        image = post.data["image"]
        result = {:id => post.id, :user_id => USER_ID,
                  :created_at => post.date,
                  :title => post.title,
                  :raw => clean_up(post.content, image),
                  :archetype => "regular",
                  :excerpt => post.excerpt,
                  :custom_fields => {:permalink => post.permalink || post.url}}
          if image
            result[:image_url] = replace_urls(image)
          end
          result
      end
    end

end

ImportScripts::Jekyll.new.perform