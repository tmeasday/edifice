Rails31::Application.routes.draw do
  match "test/base" => 'test#base'
  match "test/empty" => 'test#empty'
end
