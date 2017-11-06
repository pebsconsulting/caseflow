# This job will retrieve cases from VACOLS via the AppealRepository
# and all documents for these cases in VBMS and store them
class FetchDocumentsForReaderUserJob < ActiveJob::Base
  queue_as :low_priority

  # if a user has experienced more than DOCUMENT_FAILURE_COUNT, we consider this job as failed
  DOCUMENT_FAILURE_COUNT = 5

  def perform(reader_user)
    @counts = {
      appeals_total: 0,
      appeals_successful: 0
    }
    RequestStore.store[:application] = "reader"
    RequestStore.store[:current_user] = reader_user.user
    update_fetched_at(reader_user)
    appeals = reader_user.user.current_case_assignments
    fetch_documents_for_appeals(appeals)
    log_info

  rescue => e
    log_error
    # raising an exception here triggers a retry through shoryuken
    raise e
  end

  def update_fetched_at(reader_user)
    reader_user.update_attributes!(documents_fetched_at: Time.zone.now)
  end

  def fetch_documents_for_appeals(appeals)
    @counts[:appeals_total] = appeals.count
    appeals.each do |appeal|
      # signal to efolder X to fetch and save all documents
      appeal.saved_documents
      @counts[:appeals_successful] += 1
    end
  end

  def log_info
    Rails.logger.info log_message
  end

  def log_error
    Rails.logger.error log_message("ERROR")
  end

  def log_message(status = "SUCCESS")
    "FetchDocumentsForReaderUserJob (user_id: #{RequestStore[:current_user].id}) #{status}. " \
      "Retrieved #{@counts[:appeals_successful]} / #{@counts[:appeals_total]} appeals"
  end
end