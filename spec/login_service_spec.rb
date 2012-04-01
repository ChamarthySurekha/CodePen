require 'spec_helper'
require './services/login_service'
require './models/user'
require './models/user_github'
require './models/content'

describe LoginService do

  it "should convert User type to GithubUser type" do
    clear_db
    user = User.new(:uid => 1)
    service = LoginService.new
    new_user = service.convert_anon_user(user, {:login => 'duder'})
    new_user.uid.should == 'duder'
    User.first(:uid => 'duder').login.should == 'duder'
  end

  it "should update a regular user's info based on github info" do
    clear_db
    existing_auth_info = {'login' => 'duder', 'id' => 12, 'name' => 'timmy'}
    existing_user = GithubUser.new(existing_auth_info)
    existing_user.save
    user = LoginService.new.update_regular_user(existing_user, {'login' => 'duder', 'id' => 12, 'name' => 'funky'})
    user.name.should == 'funky'
    User.first(:uid => 'duder').name.should == 'funky'
  end

  it "should successfully log in a base User" do
    clear_db
    Content.new(:uid => 40, :version => 1, :slug => 'pizza').save.should == true
    user = User.new(:uid => 40)
    user.save.should == true
    LoginService.new.login(user, {'login' => 'pete'})
    content = Content.first(:uid => 'pete')
    content.version.should == 1
    content.slug.should == 'pizza'
  end

end
