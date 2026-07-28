// Manages suppression preferences for leads.
table l_suppression_list {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // References the lead to be suppressed, can be null.
    int lead? {
      table = "b_farm_leads"
    }
  
    // References the email to be suppressed, can be null.
    int email? {
      table = "c_lead_emails"
    }
  
    // References the phone to be suppressed, can be null.
    int phone? {
      table = "d_lead_phone_numbers"
    }
  
    // Address line 1 to be suppressed (e.g., for do-not-mail), can be null.
    text address_line1? filters=trim
  
    // Type of suppression (e.g., do_not_email, do_not_call).
    enum suppression_type? {
      values = ["do_not_email", "do_not_call", "do_not_mail", "all"]
    }
  
    // Reason for the suppression (e.g., opted_out, bounced).
    enum reason? {
      values = [
        "opted_out"
        "bounced"
        "spam_complaint"
        "dnc_registry"
        "manual"
        "legal"
      ]
    
    }
  
    // Source of the suppression request.
    enum source? {
      values = [
        "sendgrid_webhook"
        "unsubscribe_link"
        "phone_request"
        "manual_entry"
      ]
    
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}