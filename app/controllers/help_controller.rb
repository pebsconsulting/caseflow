class HelpController < ApplicationController
  skip_before_action :verify_authentication

  def welcome
    if FeatureToggle.enabled?(:case_search_home_page, user: current_user)
      verify_authentication
      @component_to_render = "Search"
    end

    render :index
  end

  def component_to_render
    @component_to_render ||= "Help"
  end
  helper_method :component_to_render
end
