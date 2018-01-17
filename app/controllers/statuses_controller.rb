class StatusesController < ApplicationController
  before_action :verify_access, :verify_feature_enabled, :set_application, :react_routed

  def index
    set_json_appeal_history
    render template: "status/index"
  end

  def create
    render json: json_appeal_history
  rescue Caseflow::Error::InvalidFileNumber
    invalid_file_number
  end

  def show
    respond_to do |format|
      format.html do
        set_json_appeal_history
        render template: "status/index"
      end
    end
  end

  private

  def set_json_appeal_history
    @json_appeal_history = json_appeal_history
  end

  def invalid_file_number
    render json: { errors: ["Invalid file number"] }, status: 422
  end

  def vacols_id
    params[:id]
  end

  def file_number
    params[:file_number]
  end

  def has_params?
    !!(vacols_id || file_number)
  end

  def vbms_id
    file_number ? Appeal.convert_file_number_to_vacols(file_number) : appeal.try(:vbms_id)
  end

  def appeal
    @appeal ||= Appeal.find_or_create_by_vacols_id(vacols_id) if vacols_id
  end

  def appeal_history
    @appeal_history ||= AppealHistory.new(vbms_id: vbms_id)
  end

  def json_appeal_history
    return nil unless has_params?
    ActiveModelSerializers::SerializableResource.new(
      appeal_history.for_api,
      each_serializer: ::V2::AppealSerializer,
      key_transform: :camel_lower
      ).as_json
  end

  def verify_access
    verify_authorized_roles("Appeal Status")
  end

  def verify_feature_enabled
    redirect_to "/unauthorized" unless FeatureToggle.enabled?(:status)
  end

  def set_application
    RequestStore.store[:application] = "status"
  end
end
