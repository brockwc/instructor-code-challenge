require 'sinatra'
require 'pry'

get '/' do
  erb :index
end

get '/favorites' do
  response.header['Content-Type'] = 'application/json'
  @file = File.read('data.json')
end

post '/favorites' do
  file = JSON.parse(File.read('data.json'))

  unless params[:name] && params[:oid]
    return 'Invalid Request'
  end
  
  movie = { name: params[:name], oid: params[:oid] }
  file << movie
  File.write('data.json',JSON.pretty_generate(file))
  movie.to_json

  redirect to('/')
end
