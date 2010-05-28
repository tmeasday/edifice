require 'ediface'

config.to_prepare do 
  Ediface.install_js_files
end

# %w{ models controllers helpers }.each do |dir|
#   path = File.join(File.dirname(__FILE__), 'app', dir)
#   $LOAD_PATH << path
#   ActiveSupport::Dependencies.load_paths << path
#   ActiveSupport::Dependencies.load_once_paths.delete(path)
# end