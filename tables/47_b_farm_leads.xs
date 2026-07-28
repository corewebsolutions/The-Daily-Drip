// Stores data for real estate leads.
table b_farm_leads {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // Lead's first name.
    text? first_name? filters=trim
  
    // Lead's last name.
    text? last_name? filters=trim
  
    // Concatenated full name of the lead.
    text full_name? filters=trim
  
    text? owner2_first_name? filters=trim
    text? owner2_last_name? filters=trim
  
    // Source of the lead.
    enum source? {
      values = ["propstream", "attom", "manual", "referral", "webform"]
    }
  
    // Current stage of the lead in the marketing lifecycle, defaults to 'cold'.
    enum lifecycle_stage? {
      values = [
        "cold"
        "warming"
        "engaged"
        "hot"
        "client"
        "past_client"
        "unsubscribed"
        "past_owner"
      ]
    
    }
  
    // Numerical score indicating lead's engagement and potential, defaults to 0.
    int lead_score?
  
    // Indicates if the lead is in the top 20% by score or importance, defaults to false.
    bool is_top_20?
  
    // Indicates if mail should not be sent to this lead, defaults to false.
    bool do_not_mail?
  
    // Timestamp of the last update to the lead's record.
    timestamp updated_at?
  
    timestamp? last_campaign_sent_at?
    timestamp? last_response_at?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]

  autocomplete = [{name: "full_name"}]
}