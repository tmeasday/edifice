module Ediface
  def self.install_js_files
    install_dir = "#{RAILS_ROOT}/public/javascripts"
    ediface_js_dir = File.join(File.dirname(__FILE__), 'public', 'javascripts', 'ediface')
    
    ::Rails.logger.warn '>>>>>>>>>>>>>>>>>copying files...'
    ::Rails.logger.warn ediface_js_dir
    ::Rails.logger.warn install_dir
    FileUtils.cp_r ediface_js_dir, install_dir
  end
end