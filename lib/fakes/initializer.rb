class Fakes::Initializer
  class << self
    def load!(rails_env: nil)
      User.authentication_service = Fakes::AuthenticationService
      CAVCDecision.repository = Fakes::CAVCDecisionRepository
      if !rails_env || !rails_env.development?
        LegacyAppeal.repository = Fakes::AppealRepository
        AttorneyCaseReview.repository = Fakes::QueueRepository
        Hearing.repository = Fakes::HearingRepository
        HearingDocket.repository = Fakes::HearingRepository
        Issue.repository = Fakes::IssueRepository
        Judge.repository = Fakes::JudgeRepository
        PowerOfAttorney.repository = Fakes::PowerOfAttorneyRepository
        User.appeal_repository = Fakes::AppealRepository
        User.user_repository = Fakes::UserRepository
        WorkQueue.repository = Fakes::QueueRepository
      end
    end

    # This method is called only 1 time during application bootup
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def app_init!(rails_env)
      if rails_env.ssh_forwarding? && !running_rake_command?
        User.authentication_service = Fakes::AuthenticationService
        # This sets up the Fake::VBMSService with documents for the VBMS ID DEMO123. We normally
        # set this up in Fakes::AppealRepository.seed! which we don't call for this environment.
        Fakes::VBMSService.document_records = { "DEMO123" => Fakes::Data::AppealData.static_reader_documents }
      end

      if rails_env.stubbed? || rails_env.demo? || rails_env.development?
        # If we are running a rake command like `rake db:seed` or
        # `rake db:schema:load`, we do not want to try and seed the fakes
        # because our schema may not be loaded yet and it will fail!
        if running_rake_command?
          load!(rails_env: rails_env)
        else
          load_fakes_and_seed!(rails_env: rails_env)
        end
      end
    end
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity

    # This setup method is called on every request during development
    # to properly reload class attributes like the fake repositories and
    # their seed data (which is currently cached as class attributes)
    def setup!(rails_env, app_name: nil)
      load_fakes_and_seed!(rails_env: rails_env, app_name: app_name) if rails_env.stubbed?
    end

    private

    def load_fakes_and_seed!(rails_env:, app_name: nil)
      load!(rails_env: rails_env)

      User.authentication_service.vacols_regional_offices = {
        "DSUSER" => "DSUSER",
        "RO13" => "RO13"
      }

      User.authentication_service.user_session = {
        "id" => "Fake User",
        "css_id" => "FAKEUSER",
        "roles" =>
          ["Certify Appeal", "Establish Claim", "Download eFolder", "Manage Claim Establishment"],
        "station_id" => "283",
        "email" => "america@example.com",
        "name" => "Cave Johnson"
      }

      # FACOLS needs to match veteran records through Fakes::BGSService for Dispatch(EPs)
      Fakes::BGSService.create_veteran_records if rails_env.development?

      return if rails_env.development?
      Functions.grant!("Global Admin", users: ["System Admin"])

      Fakes::AppealRepository.seed!(app_name: app_name)
      Fakes::HearingRepository.seed! if app_name.nil? || app_name == "hearings" || app_name == "reader"
    end

    def running_rake_command?
      File.basename($PROGRAM_NAME) == "rake"
    end
  end
end
