require File.dirname(__FILE__) + '/spec_helper'

describe UsersController do
  include RSpec::Rails::ControllerExampleGroup
  render_views
  
  it 'should set correct body classes' do
    get :index
    assert_select 'body.c_users.v_index.l_application'
  end
  
  it 'should set correct meta tags' do
    get :index
    
    assert_select 'meta[name=edifice-view_path][content=users]'
    assert_select 'meta[name=edifice-view_name][content=index]'
    assert_select 'meta[name=edifice-layout][content=application]'
  end
  
end