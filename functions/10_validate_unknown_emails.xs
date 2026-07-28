// Validates unknown emails using ZeroBounce API and updates their status.
function validate_unknown_emails {
  input {
  }

  stack {
    db.query c_lead_emails {
      where = $db.c_lead_emails.email_status == "unknown"
      return = {type: "list"}
    } as $unknown_emails
  
    var $total_processed {
      value = 0
    }
  
    var $valid_count {
      value = 0
    }
  
    var $invalid_count {
      value = 0
    }
  
    var $risky_count {
      value = 0
    }
  
    var $unknown_count {
      value = 0
    }
  
    var $error_count {
      value = 0
    }
  
    foreach ($unknown_emails) {
      each as $email_record {
        var.update $total_processed {
          value = $total_processed + 1
        }
      
        try_catch {
          try {
            api.request {
              url = "https://api.zerobounce.net/v2/validate"
              method = "GET"
              params = {}
                |set:"api_key":$env.zerobounce_key
                |set:"email":$email_record.email
                |set:"ip_address":""
            } as $zb_response
          
            var $new_status {
              value = "unknown"
            }
          
            switch ($zb_response.response.result.status) {
              case ("valid") {
                var.update $new_status {
                  value = "valid"
                }
              } break
            
              case ("catch-all") {
                var.update $new_status {
                  value = "risky"
                }
              } break
            
              case ("invalid") {
                var.update $new_status {
                  value = "invalid"
                }
              } break
            
              case ("spamtrap") {
                var.update $new_status {
                  value = "invalid"
                }
              } break
            
              case ("abuse") {
                var.update $new_status {
                  value = "invalid"
                }
              } break
            
              case ("do_not_mail") {
                var.update $new_status {
                  value = "invalid"
                }
              } break
            
              default {
                var.update $new_status {
                  value = "unknown"
                }
              }
            }
          
            db.edit c_lead_emails {
              field_name = "id"
              field_value = $email_record.id
              data = {
                email_status    : $new_status
                sendgrid_bounced: ($new_status == "invalid")
              }
            } as $updated_email
          
            conditional {
              if ($new_status == "valid") {
                var.update $valid_count {
                  value = $valid_count + 1
                }
              }
            
              elseif ($new_status == "invalid") {
                var.update $invalid_count {
                  value = $invalid_count + 1
                }
              }
            
              elseif ($new_status == "risky") {
                var.update $risky_count {
                  value = $risky_count + 1
                }
              }
            
              elseif ($new_status == "unknown") {
                var.update $unknown_count {
                  value = $unknown_count + 1
                }
              }
            }
          }
        
          catch {
            var.update $error_count {
              value = $error_count + 1
            }
          }
        }
      }
    }
  }

  response = {
    total_processed: $total_processed
    valid_count    : $valid_count
    invalid_count  : $invalid_count
    risky_count    : $risky_count
    unknown_count  : $unknown_count
    error_count    : $error_count
  }
}