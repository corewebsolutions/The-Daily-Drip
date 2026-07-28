// Records general interactions with leads.
table p_touchpoints {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // References the lead involved in this interaction.
    int lead? {
      table = "b_farm_leads"
    }
  
    // The communication channel used for this interaction.
    enum channel? {
      values = [
        "email"
        "phone"
        "mail"
        "in_person"
        "linkedin"
        "sms"
        "voicemail"
        "import"
      ]
    
    }
  
    // Notes about the interaction, can be null.
    text note? filters=trim
  
    // Indicates who or what created the touchpoint, defaults to 'system'.
    enum created_by? {
      values = ["system", "marcela"]
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}