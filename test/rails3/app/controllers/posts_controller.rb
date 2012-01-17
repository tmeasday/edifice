class PostsController < ApplicationController
  respond_to :html, :json
  
  def new
    @post = Post.new
    
    respond_with @post
  end
  
  def create
    @post = Post.create params[:post]
    
    respond_with @post
  end
end
