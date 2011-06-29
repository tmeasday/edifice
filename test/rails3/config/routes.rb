Rails3::Application.routes.draw do
  resources :posts
  root :to => 'posts#new'
end
