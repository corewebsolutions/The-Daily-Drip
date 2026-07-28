// Stores email addresses and their statuses for leads.
table c_lead_emails {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // References the lead associated with this email address.
    int lead? {
      table = "b_farm_leads"
    }
  
    // The email address.
    text email? filters=trim
  
    int owner_number?=1
  
    // Current status of the email address, defaults to 'unknown'.
    enum email_status? {
      values = ["valid", "invalid", "risky", "unknown"]
    }
  
    // Indicates if this is the primary email address for the lead, defaults to false.
    bool is_primary?
  
    // Source from which the email address was obtained.
    enum source? {
      values = ["propstream", "attom", "manual", "webform"]
    }
  
    // Indicates if the email has bounced via SendGrid, defaults to false.
    bool sendgrid_bounced?
  
    // Indicates if the lead unsubscribed via SendGrid, defaults to false.
    bool sendgrid_unsubscribed?
  
    // Indicates if the lead reported spam, defaults to false.
    bool spam_complained?
  
    // Timestamp of the last time an email to this address was opened, can be null.
    timestamp? last_open_at?
  
    // Timestamp of the last time a link in an email to this address was clicked, can be null.
    timestamp? last_click_at?
  
    // Timestamp of the last update to the email record.
    timestamp updated_at?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}