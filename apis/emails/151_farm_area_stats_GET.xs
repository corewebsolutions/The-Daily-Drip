// Get email statistics for a specific farm area
query farm_area_stats verb=GET {
  api_group = "emails"

  input {
    // Name of the farm area to get statistics for
    // Name of the farm area
    text farm_area_name filters=trim
  }

  stack {
    // Query e_farm_properties to get all lead IDs associated with the farm_area_name
    db.query e_farm_properties {
      where = $db.e_farm_properties.farm_area_name == $input.farm_area_name
      return = {type: "list"}
    } as $properties
  
    // Extract and get unique lead IDs from properties
    var $property_lead_ids {
      value = $properties
        |map:$$.lead
        |unique
        |filter_empty
    }
  
    // Query b_farm_leads filtering out 'past_owner' and 'unsubscribed'
    db.query b_farm_leads {
      where = $db.b_farm_leads.id in $property_lead_ids && $db.b_farm_leads.lifecycle_stage != "past_owner" && $db.b_farm_leads.lifecycle_stage != "unsubscribed"
      return = {type: "list"}
    } as $active_leads
  
    // Extract active lead IDs
    var $active_lead_ids {
      value = $active_leads|map:$$.id
    }
  
    // Calculate the count of unique active lead IDs
    var $total_active_leads {
      value = $active_lead_ids|count
    }
  
    // Query c_lead_emails for these active leads
    db.query c_lead_emails {
      where = $db.c_lead_emails.lead in $active_lead_ids
      return = {type: "list"}
    } as $lead_emails
  
    // Iterate through the retrieved email records and count email_status categories
    var $status_counts {
      value = {valid: 0, invalid: 0, risky: 0, unknown: 0}
    }
  
    foreach ($lead_emails) {
      each as $email {
        conditional {
          if ($email.email_status == "valid") {
            var.update $status_counts {
              value = $status_counts
                |set:"valid":$status_counts.valid + 1
            }
          }
        
          elseif ($email.email_status == "invalid") {
            var.update $status_counts {
              value = $status_counts
                |set:"invalid":$status_counts.invalid + 1
            }
          }
        
          elseif ($email.email_status == "risky") {
            var.update $status_counts {
              value = $status_counts
                |set:"risky":$status_counts.risky + 1
            }
          }
        
          elseif ($email.email_status == "unknown") {
            var.update $status_counts {
              value = $status_counts
                |set:"unknown":$status_counts.unknown + 1
            }
          }
        }
      }
    }
  
    // Group the email records by lead ID
    array.group_by ($lead_emails) {
      by = $this.lead
    } as $emails_by_lead
  
    // Filter to find leads that have at least one email with an email_status of 'valid' and count them
    var $leads_with_valid_email_count {
      value = 0
    }
  
    object.values {
      value = $emails_by_lead
    } as $grouped_emails
  
    foreach ($grouped_emails) {
      each as $lead_email_group {
        array.has ($lead_email_group) if ($this.email_status == "valid") as $has_valid_email
        conditional {
          if ($has_valid_email) {
            var.update $leads_with_valid_email_count {
              value = $leads_with_valid_email_count + 1
            }
          }
        }
      }
    }
  
    // Subtract the count of leads with valid email from total active leads
    var $leads_with_no_valid_email {
      value = $total_active_leads - $leads_with_valid_email_count
    }
  
    // Calculate the percentage of leads with at least one valid email
    var $percentage_with_valid_email {
      value = ($total_active_leads > 0) ? (($leads_with_valid_email_count / $total_active_leads) * 100) : 0
    }
  
    // Combine all calculated statistics into a single JSON object
    var $response_data {
      value = {
        total_active_leads         : $total_active_leads
        status_counts              : $status_counts
        leads_with_valid_email     : $leads_with_valid_email_count
        leads_with_no_valid_email  : $leads_with_no_valid_email
        percentage_with_valid_email: $percentage_with_valid_email
      }
    }
  }

  response = $response_data
}