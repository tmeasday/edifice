require File.dirname(__FILE__) + '/spec_helper'

describe 'pjax support', :type => :request, :js => true do
  it "should alter the metatags when using pjax" do
    visit('/test/empty')
    page.should have_selector('meta[name=edifice-view_name][content=empty]')
    
    page.evaluate_script('jQuery.pjax({url: "/test/base", container: "body"})')
    page.should have_selector('meta[name=edifice-view_name][content=base]')
  end
  
  it "should not alter the metatags otherwise" do
    visit('/test/empty')
    page.should have_selector('meta[name=edifice-view_name][content=empty]')
    
    page.evaluate_script('jQuery.ajax("/test/base")')
    page.should have_selector('meta[name=edifice-view_name][content=empty]')
  end
  
  it "should alter the body classes when using pjax" do
    visit('/test/empty')
    page.should have_selector('body.v_empty')
    
    page.evaluate_script('jQuery.pjax({url: "/test/base", container: "body"})')
    page.should have_selector('body.v_base')
  end
  
  it "should not alter the body classes otherwise" do
    visit('/test/empty')
    page.should have_selector('body.v_empty')
    
    page.evaluate_script('jQuery.ajax("/test/base")')
    page.should have_selector('body.v_empty')
  end
end