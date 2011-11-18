# kind of the evolution of the FormStruct

module Edifice
  class FormModel
    include ActiveModel::Validations
    include ActiveModel::Conversion
    extend  ActiveModel::Naming
    extend ActiveModel::Callbacks
    define_model_callbacks :save
    
    # more or less the same as activerecord's one
    class RecordInvalid < Exception
      attr_reader :record
      def initialize(record)
        @record = record
        errors = @record.errors.full_messages.join(", ")
        super(errors)
      end
    end
    
    def initialize(attributes = {})
        attributes.each { |n, v| send("#{n}=", v) if respond_to?("#{n}=") }
    end
    
    # default implementation, override as necessary
    def save
      run_callbacks :save do
        valid?
      end
    end
    
    def save!
      save || raise(RecordInvalid.new(self))
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