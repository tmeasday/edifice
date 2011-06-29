# kind of the evolution of the FormStruct

module Edifice
  class FormModel
    include ActiveModel::Validations
    include ActiveModel::Conversion
    extend  ActiveModel::Naming
    
    def initialize(attributes = {})
        attributes.each { |n, v| send("#{n}=", v) if respond_to?("#{n}=") }
    end
    
    # default implementation, override as necessary
    def save
      valid?
    end
    
    def self.create(attributes = {})
      form = new(attributes)
      form.save
      form
    end
    
    def persisted?
      false
    end
  end
end