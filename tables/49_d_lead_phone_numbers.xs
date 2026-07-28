// Stores phone numbers for leads.
table d_lead_phone_numbers {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // References the lead associated with this phone number.
    int lead? {
      table = "b_farm_leads"
    }
  
    // The phone number.
    text phone? filters=trim
  
    // Type of the phone number (e.g., mobile, landline), defaults to 'unknown'.
    enum phone_type? {
      values = ["mobile", "landline", "voip", "unknown"]
    }
  
    // Indicates if this is the primary phone number for the lead, defaults to false.
    bool is_primary?
  
    // Indicates if this phone number should not be called, defaults to false.
    bool do_not_call?
  
    // Indicates if the 'do not call' status has been verified, defaults to false.
    bool dnc_verified?
  
    // Source from which the phone number was obtained.
    enum source? {
      values = ["propstream", "attom", "manual"]
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}