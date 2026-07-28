// Records lead responses to marketing efforts.
table i_lead_responses {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // References the lead who made the response.
    int lead? {
      table = "b_farm_leads"
    }
  
    // References the campaign that prompted the response, can be null.
    int campaign? {
      table = "f_campaigns"
    }
  
    // References the specific touchpoint that led to the response, can be null.
    int touchpoint? {
      table = "g_campaign_touchpoints"
    }
  
    // Type of response received (e.g., QR scan, form submission).
    enum response_type? {
      values = [
        "qr_scan"
        "form_submission"
        "email_reply"
        "phone_call"
        "voicemail_callback"
        "walk_in"
        "referral"
      ]
    
    }
  
    // Channel through which the response was received.
    enum response_channel? {
      values = ["web", "email", "phone", "in_person"]
    }
  
    // Additional notes about the response, can be null.
    text notes? filters=trim
  
    // Indicates if Marcela (an agent/system) was notified about this response, defaults to false.
    bool marcela_notified?
  
    // Timestamp when Marcela was notified, can be null.
    timestamp marcela_notified_at?
  
    // Indicates if a follow-up action for this response has been completed, defaults to false.
    bool follow_up_completed?
  
    // Timestamp when the follow-up was completed, can be null.
    timestamp follow_up_completed_at?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}