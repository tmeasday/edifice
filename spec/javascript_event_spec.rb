require File.dirname(__FILE__) + '/spec_helper'

describe 'javascript events', :type => :request, :js => true do
  it "should fire the onReady event" do
    visit('/test/base')
    
    # this gets added onReady
    page.should have_selector('h1.ready')
  end
  
  it "should fire the onLoad event" do
    visit('/test/base')
    
    # this gets added onReady
    page.should have_selector('h1.load')
  end
  
  it "should fire the onReady event via AJAX" do
    visit('/test/empty')
    page.should have_no_selector('h1.ready')
    
    page.evaluate_script('jQuery.get("/test/base")')
    page.should have_selector('h1.ready')
  end
end