// Logs changes to lead scores and the reasons behind them.
table j_lead_score_log {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // References the lead whose score was modified.
    int lead? {
      table = "b_farm_leads"
    }
  
    // Lead's score before the change.
    int score_before?
  
    // Lead's score after the change.
    int score_after?
  
    // The change in score (positive or negative).
    int delta?
  
    // Reason for the score change.
    enum reason? {
      values = [
        "email_opened"
        "email_clicked"
        "qr_scanned"
        "form_submitted"
        "email_replied"
        "phone_called"
        "voicemail_callback"
        "email_bounced"
        "unsubscribed"
        "manual_adjustment"
        "score_decay"
      ]
    
    }
  
    // ID of the source record (e.g., `email_event.id`) that caused the score change, can be null.
    int source_id?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}