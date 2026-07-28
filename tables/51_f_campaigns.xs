// Manages marketing campaigns targeting leads.
table f_campaigns {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // Name of the marketing campaign.
    text campaign_name? filters=trim
  
    // The target month for the campaign.
    date month?
  
    // References the neighborhood targeted by the campaign, can be null.
    int neighborhood? {
      table = "a_neighborhoods"
    }
  
    // Current status of the campaign, defaults to 'draft'.
    enum status? {
      values = ["draft", "scheduled", "running", "completed", "failed"]
    }
  
    // JSON field for storing campaign-specific market data, can be null.
    json market_data?
  
    // Total number of leads included in the campaign, defaults to 0.
    int total_leads?
  
    // Total number of communications sent in the campaign, defaults to 0.
    int total_sent?
  
    // Timestamp when the campaign was completed, can be null.
    timestamp? completed_at?
  
    bool cron_lock?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}