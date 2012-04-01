require "./models/user_github"

class LoginService

  def login(user, auth_info)
    if user.anon?
      convert_anon_user(user, auth_info)
    else
      update_regular_user(user, auth_info)
    end
  end

  def convert_anon_user(user, auth_info)
    new_user = GithubUser.new(auth_info)
    new_user.save
    Content.copy_ownership(user, new_user.uid)
    new_user
  end

  def update_regular_user(user, auth_info)
    if auth_info['id'] == user.id
      user.update_attributes!(auth_info)
      user
    end
  end

end
