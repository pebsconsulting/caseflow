class AttorneyVacolsAssignment < VacolsAssignment
  def self.from_vacols(case_assignment, user_id)
    task = super
    task.assigned_on = case_assignment.assigned_to_attorney_date
    task
  end
end
