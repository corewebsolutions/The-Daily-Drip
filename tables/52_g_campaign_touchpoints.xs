// Tracks individual interactions within marketing campaigns.
table g_campaign_touchpoints {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // References the campaign this touchpoint belongs to.
    int campaign? {
      table = "f_campaigns"
    }
  
    // References the lead targeted by this touchpoint.
    int lead? {
      table = "b_farm_leads"
    }
  
    // References the property associated with this touchpoint.
    int property? {
      table = "e_farm_properties"
    }
  
    // References the email used for this touchpoint, can be null.
    int email? {
      table = "c_lead_emails"
    }
  
    // References the phone used for this touchpoint, can be null.
    int phone? {
      table = "d_lead_phone_numbers"
    }
  
    // The communication channel used for the touchpoint.
    enum channel? {
      values = [
        "email_teaser"
        "email_report"
        "email_personal"
        "postcard"
        "letter"
        "voicemail"
      ]
    
    }
  
    // Current status of the touchpoint, defaults to 'pending'.
    enum status? {
      values = [
        "pending"
        "sent"
        "delivered"
        "failed"
        "bounced"
        "opted_out"
        "skipped"
      ]
    
    }
  
    // Reason if the touchpoint was skipped, can be null.
    text skipped_reason? filters=trim
  
    // Timestamp when the touchpoint was scheduled.
    timestamp scheduled_at?
  
    // Timestamp when the touchpoint was sent, can be null.
    timestamp sent_at?
  
    // Timestamp when the touchpoint was delivered, can be null.
    timestamp delivered_at?
  
    // Timestamp when the touchpoint failed, can be null.
    timestamp failed_at?
  
    // External identifier for the touchpoint (e.g., from a mailing service), can be null.
    text external_id? filters=trim
  
    // Cost of the touchpoint in cents, can be null.
    int cost_cents?
  
    // JSON field for additional metadata, can be null.
    json metadata?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}