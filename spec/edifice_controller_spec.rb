require File.dirname(__FILE__) + '/spec_helper'

describe TestController do
  include RSpec::Rails::ControllerExampleGroup
  render_views
  
  it 'should set correct body classes' do
    get :base
    assert_select 'body.c_test.v_base.l_application'
  end
  
  it 'should set correct meta tags' do
    get :base
    
    assert_select 'meta[name=edifice-view_path][content=test]'
    assert_select 'meta[name=edifice-view_name][content=base]'
    assert_select 'meta[name=edifice-layout][content=application]'
  end
  
  it 'should set correct response headers' do
    get :base
    
    response.headers.keys.should include('x-edifice-view_path', 'x-edifice-view_name', 'x-edifice-layout')
    response.headers['x-edifice-view_path'].should ==('test')
    response.headers['x-edifice-view_name'].should ==('base')
    response.headers['x-edifice-layout'].should ==('application')
  end
end