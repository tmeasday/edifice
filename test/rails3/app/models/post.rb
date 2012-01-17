class Post < Edifice::FormModel
  attr_accessor :title
  attr_accessor :message
  attr_accessor :email
  
  # just check the email has an @ and a dot. Anything else is false economy
  validates :email, :presence => true, :format => {:with => /^.+@.+\..+$/}
  validates :title, :presence => true
  validates :message, :presence => true
end
