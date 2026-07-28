// Logs detailed email interaction events for leads.
table h_email_events {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // References the lead associated with this email event.
    int lead? {
      table = "b_farm_leads"
    }
  
    // References the email address involved in this event, can be null.
    int email? {
      table = "c_lead_emails"
    }
  
    // References the campaign related to this email event, can be null.
    int campaign? {
      table = "f_campaigns"
    }
  
    // References the specific touchpoint that generated this email event, can be null.
    int touchpoint? {
      table = "g_campaign_touchpoints"
    }
  
    // The message ID from SendGrid for this email.
    text sendgrid_message_id? filters=trim
  
    // Type of email event (e.g., delivered, open, click).
    enum event_type? {
      values = [
        "delivered"
        "open"
        "click"
        "bounce"
        "spam_report"
        "unsubscribe"
        "deferred"
      ]
    
    }
  
    // URL clicked if the event type is 'click', can be null.
    text click_url? filters=trim
  
    // User agent string of the client that triggered the event, can be null.
    text user_agent? filters=trim
  
    // IP address of the client that triggered the event, can be null.
    text ip_address? filters=trim
  
    // Timestamp when the email event occurred.
    timestamp occurred_at?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}