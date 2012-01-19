# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "edifice/version"

Gem::Specification.new do |s|
  s.name        = "edifice"
  s.version     = Edifice::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Tom Coleman", "Zoltan Olah", "Joe Dollard"]
  s.email       = ["tom@thesnail.org", "zol@me.com", "jdollard@gmail.com"]
  s.homepage    = "http://github.com/tmeasday/edifice"
  s.summary     = %q{Ediface is a Javascript framework released as a rails plugin.}
  s.description = %q{The idea here is to communicate which view is rendering to the javascript so that we can call the correct javascript files in an automagical way.}

  s.rubyforge_project = "edifice"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]
  
  s.add_development_dependency 'rake'
  s.add_development_dependency 'rails'
  s.add_development_dependency 'rspec-rails'
  s.add_development_dependency 'capybara'
  s.add_development_dependency 'jquery-rails'
end
