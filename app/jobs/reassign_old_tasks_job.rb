class ReassignOldTasksJob < ApplicationJob
  queue_as :low_priority

  def perform
    Task.assigned_not_completed.where(type: Task::REASSIGN_OLD_TASKS).each(&:expire!)
  end
end
