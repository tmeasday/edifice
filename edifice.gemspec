# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "edifice/version"

Gem::Specification.new do |s|
  s.name        = "edifice"
  s.version     = Edifice::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Tom Coleman", "Zoltan Olah", "Joe Dollard"]
  s.email       = ["tom@thesnail.org", "zol@me.com", "jdollard@gmail.com"]
  s.homepage    = "http://edifice-rails.com"
  s.summary     = %q{Edifice is a Rails gem that simplifies the way you manage your CSS and Javascript.}
  s.description = %q{Edifice makes your Rails life easier. It's designed to simplify CSS & JS integration in your Rails app by following the principle of DRY, less obtrusive markup. Stop writing unnecessary javascript boilerplate, stop wasting time namespacing view CSS and start enjoying rails again..}

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
