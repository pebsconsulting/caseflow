class Document < ActiveRecord::Base
  has_many :annotations
  has_many :document_views
  has_many :documents_tags
  has_many :tags, through: :documents_tags
  has_paper_trail only: [:description, :category_case_summary, :category_medical, :category_other, :category_procedural]

  self.inheritance_column = nil

  # Document types are defined in the following file in
  # caseflow commons: /app/models/caseflow/document_types.rb
  # some of these names are confusing and are overriden
  # in the following table.
  TYPES_OVERRIDE = {
    "73" => "NOD",
    "95" => "SOC",
    "97" => "SSOC",
    "178" => "Form 8",
    "179" => "Form 9",
    "713" => "NOD",
    "856" => "NOD",
    "857" => "Form 9"
  }.freeze

  ALT_TYPES = {
    "Appeals - Notice of Disagreement (NOD)" => "NOD",
    "Appeals - Statement of the Case (SOC)" => "SOC",
    "Appeals - Substantive Appeal to Board of Veterans' Appeals" => "Form 9",
    "Appeals - Supplemental Statement of the Case (SSOC)" => "SSOC"
  }.freeze

  CASE_SUMMARY_TYPES = [
    "NOD",
    "Notice of Disagreement",
    "SOC",
    "Statement of Case (SOC)",
    "Form 9",
    "VA 9 Appeal to Board of Appeals",
    "Form 8",
    "VA 8 Certification of Appeal",
    "BVA Decision",
    "SSOC",
    "Supplemental Statement of Case (SSOC)",
    "DD 214 Certified Original - Certificate of Release or Discharge From Active Duty",
    "Rating Decision - Codesheet",
    "Rating Decision - Narrative",
    "VA 21-526EZ, Fully Developed Claim (Compensation)",
    "VA 21-527EZ, Fully Developed Claim (Pension)"
  ].freeze

  CASE_SUMMARY_RECENT_DOCUMENT_CUTOFF = 30.days.ago.freeze

  DECISION_TYPES = ["BVA Decision", "Remand BVA or CAVC"].freeze
  FUZZY_MATCH_DAYS = 4.days.freeze

  attr_accessor :efolder_id, :alt_types, :filename, :vacols_date

  def type?(type)
    (self.type == type) || (alt_types || []).include?(type)
  end

  def receipt_date
    received_at && received_at.to_date
  end

  def match_vbms_document_from(vbms_documents)
    match_vbms_document_using(vbms_documents) { |doc| doc.receipt_date == vacols_date }
  end

  def fuzzy_match_vbms_document_from(vbms_documents)
    match_vbms_document_using(vbms_documents) { |doc| fuzzy_date_match?(doc) }
  end

  # If a document was created with a vacols_date and merged with a matching vbms
  # document with a receipt_date, then the document is considered to be "matching"
  def matching?
    !!(received_at && vacols_date)
  end

  def self.type_from_vbms_type(vbms_type)
    TYPES_OVERRIDE[vbms_type] ||
      Caseflow::DocumentTypes::TYPES[vbms_type.to_i] ||
      :other
  end

  def self.from_efolder(hash, file_number)
    new(efolder_id: hash["id"],
        type: type_from_vbms_type(hash["type_id"]),
        received_at: hash["received_at"],
        vbms_document_id: hash["external_document_id"] || hash["version_id"],
        series_id: hash["series_id"] || hash["version_id"] || hash["external_document_id"],
        file_number: file_number)
  end

  def self.from_vbms_document(vbms_document, file_number)
    new(type: type_from_vbms_type(vbms_document.doc_type),
        alt_types: (vbms_document.alt_doc_types || []).map { |type| ALT_TYPES[type] },
        received_at: vbms_document.received_at,
        vbms_document_id: vbms_document.document_id,
        filename: vbms_document.filename,
        file_number: file_number)
  end

  def self.type_id(type)
    TYPES_OVERRIDE.key(type) ||
      Caseflow::DocumentTypes::TYPES.key(type)
  end

  # Currently three levels of caching. Try to serve content
  # from memory, then look to S3 if it's not in memory, and
  # if it's not in S3 grab it from VBMS
  # Log where we get the file from for now for easy verification
  # of S3 integration.
  def fetch_and_cache_document_from_vbms
    @content = vbms.fetch_document_file(self)
    S3Service.store_file(file_name, @content)
    Rails.logger.info("File #{vbms_document_id} fetched from VBMS")
    @content
  end

  def fetch_content
    content = S3Service.fetch_content(file_name)
    content && Rails.logger.info("File #{vbms_document_id} fetched from S3")
    content || fetch_and_cache_document_from_vbms
  end

  def content
    @content ||= fetch_content
  end

  def serve
    File.binwrite(default_path, content)
    default_path
  end

  def file_name
    vbms_document_id.to_s
  end

  def default_path
    File.join(Rails.root, "tmp", "pdfs", file_name)
  end

  def serializable_hash(options = {})
    super({
      methods: [
        :vbms_document_id,
        :content_url,
        :type,
        :received_at,
        :filename,
        :category_procedural,
        :category_medical,
        :category_other,
        :category_case_summary,
        :serialized_vacols_date,
        :serialized_receipt_date,
        :matching?
      ]
    }.update(options))
  end

  def to_hash
    serializable_hash
  end

  def merge_into(document)
    document.assign_attributes(
      efolder_id: efolder_id,
      type: type,
      alt_types: alt_types,
      received_at: received_at,
      filename: filename,
      vbms_document_id: vbms_document_id,
      series_id: series_id
    )

    document
  end

  def category_case_summary
    CASE_SUMMARY_TYPES.include?(type) || received_at >= CASE_SUMMARY_RECENT_DOCUMENT_CUTOFF
  end

  def serialized_vacols_date
    serialize_date(vacols_date)
  end

  def serialized_receipt_date
    serialize_date(receipt_date)
  end

  def content_url
    if reader_with_efolder_api?
      ExternalApi::EfolderService.efolder_content_url(efolder_id)
    else
      "/document/#{id}/pdf"
    end
  end

  private

  def reader_with_efolder_api?
    EFolderService == ExternalApi::EfolderService &&
      RequestStore.store[:application] == "reader" &&
      FeatureToggle.enabled?(:efolder_docs_api, user: RequestStore.store[:current_user])
  end

  def match_vbms_document_using(vbms_documents, &date_match_test)
    match = vbms_documents.detect do |doc|
      date_match_test.call(doc) && doc.type?(type)
    end

    match ? merge_with(match) : self
  end

  # Because VBMS does not allow the receipt date to be set after the upload date,
  # we allow it to be up to 4 days before the VACOLS date in some scenarios. In
  # these scenarios we "fuzzy match" the VBMS and VACOLS dates.
  def fuzzy_date_match?(vbms_document)
    ((vacols_date - FUZZY_MATCH_DAYS)..vacols_date).cover?(vbms_document.receipt_date)
  end

  def serialize_date(date)
    date ? date.to_formatted_s(:short_date) : ""
  end

  def merge_with(document)
    document.merge_into(self)
  end

  def vbms
    VBMSService
  end
end
