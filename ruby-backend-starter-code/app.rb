require 'sinatra'
require 'pry'

get '/' do
  File.read('views/index.html')
end

get '/favorites' do
  response.header['Content-Type'] = 'application/json'
  File.read('data.json')
end

post '/favorites' do
  file = JSON.parse(File.read('data.json'))
  
  unless params[:name] && params[:oid]
    return 'Invalid Request'
  end

  film = { name: params[:name], oid: params[:oid] }
  file = file.merge(film)

  File.open('data.json', 'w') do |f|
    f.write(JSON.pretty_generate(file))
  end

  # File.write('data.json', JSON.pretty_generate(file))
  # film.to_json
end
