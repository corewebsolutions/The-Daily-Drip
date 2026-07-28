// Logs generated marketing reports.
table o_report_history {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // References the neighborhood the report is about.
    int neighborhood? {
      table = "a_neighborhoods"
    }
  
    // References the campaign associated with this report, can be null.
    int campaign? {
      table = "f_campaigns"
    }
  
    // Timestamp when the report was generated.
    timestamp generated_at?
  
    // URL to the generated PDF report, can be null.
    text pdf_url? filters=trim
  
    // Number of emails sent for this report, defaults to 0.
    int emails_sent?
  
    // Status of the report generation (e.g., success, failed).
    enum status? {
      values = ["success", "failed"]
    }
  
    // Error message if report generation failed, can be null.
    text error_message? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}