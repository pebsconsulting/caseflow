class AppealView < ActiveRecord::Base
  belongs_to :appeal
  belongs_to :user
end
