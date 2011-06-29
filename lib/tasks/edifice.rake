namespace :edifice do
  desc "Installs the edifice JS files into public/javascripts/edifice"
  task :install do
    Edifice.install_js_files
  end
end