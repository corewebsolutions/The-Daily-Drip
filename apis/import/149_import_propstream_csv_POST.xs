// Imports PropStream CSV data into the database, handling leads, properties, emails, and phones.
query import_propstream_csv verb=POST {
  api_group = "Import"

  input {
    file file
    text? farm_area_name
    int? offset
  }

  stack {
    stream.from_csv {
      value = $input.file
      separator = ","
      enclosure = '"'
      escape_char = '"'
    } as $rows
  
    var $total_rows_processed {
      value = 0
    }
  
    var $new_leads_created {
      value = 0
    }
  
    var $existing_leads_updated {
      value = 0
    }
  
    var $ownership_changes {
      value = 0
    }
  
    var $new_emails_added {
      value = 0
    }
  
    var $new_phones_added {
      value = 0
    }
  
    var $rows_skipped {
      value = 0
    }
  
    var $skipped_log {
      value = []
    }
  
    var $row_index {
      value = 0
    }
  
    foreach ($rows) {
      each as $row {
        var.update $row_index {
          value = $row_index + 1
        }
      
        conditional {
          if ($input.offset != null && $row_index <= $input.offset) {
            continue
          }
        }
      
        conditional {
          if ($input.offset != null && $row_index > $input.offset + 100) {
            continue
          }
        
          elseif ($input.offset == null && $row_index > 100) {
            continue
          }
        }
      
        var.update $total_rows_processed {
          value = $total_rows_processed + 1
        }
      
        conditional {
          if ($row.Litigator == "Yes" || ($row.Address|is_empty)) {
            var.update $rows_skipped {
              value = $rows_skipped + 1
            }
          
            array.push $skipped_log {
              value = {
                address: $row.Address
                reason : "Litigator or missing address"
              }
            }
          
            continue
          }
        }
      
        var $apn_value {
          value = $row.APN|to_text
        }
      
        db.query e_farm_properties {
          where = $db.e_farm_properties.apn == $apn_value
          return = {type: "single"}
        } as $existing_property
      
        var $mode {
          value = ($existing_property == null) ? "INSERT" : "UPDATE"
        }
      
        var $owner1_first {
          value = $row["Owner 1 First Name"]
        }
      
        var $owner1_last {
          value = $row["Owner 1 Last Name"]
        }
      
        var $owner2_first {
          value = $row["Owner 2 First Name"]
        }
      
        var $owner2_last {
          value = $row["Owner 2 Last Name"]
        }
      
        var $full_name {
          value = ($owner1_first ~ " " ~ $owner1_last)|trim
        }
      
        var $do_not_mail {
          value = ($row["Do Not Mail"] == "Yes") ? true : false
        }
      
        var $area_name {
          value = ($input.farm_area_name != null) ? $input.farm_area_name : $row["Marketing Lists"]
        }
      
        var $lead_id {
          value = null
        }
      
        conditional {
          if ($mode == "INSERT") {
            db.add b_farm_leads {
              data = {
                first_name       : $owner1_first
                last_name        : $owner1_last
                full_name        : $full_name
                owner2_first_name: $owner2_first
                owner2_last_name : $owner2_last
                source           : "propstream"
                do_not_mail      : $do_not_mail
                lifecycle_stage  : "cold"
                lead_score       : 0
                is_top_20        : false
              }
            } as $lead
          
            var.update $lead_id {
              value = $lead.id
            }
          
            var.update $new_leads_created {
              value = $new_leads_created + 1
            }
          }
        
          else {
            var $existing_lead_id {
              value = $existing_property.lead|to_int
            }
          
            db.query b_farm_leads {
              where = $db.b_farm_leads.id == $existing_lead_id
              return = {type: "single"}
            } as $existing_lead
          
            conditional {
              if ($existing_lead.last_name != $owner1_last) {
                db.edit b_farm_leads {
                  field_name = "id"
                  field_value = $existing_lead.id
                  data = {lifecycle_stage: "past_owner"}
                } as $past_owner_lead
              
                db.add b_farm_leads {
                  data = {
                    first_name       : $owner1_first
                    last_name        : $owner1_last
                    full_name        : $full_name
                    owner2_first_name: $owner2_first
                    owner2_last_name : $owner2_last
                    source           : "propstream"
                    lifecycle_stage  : "cold"
                    lead_score       : 0
                    is_top_20        : false
                    do_not_mail      : $do_not_mail
                  }
                } as $lead
              
                var.update $lead_id {
                  value = $lead.id
                }
              
                var.update $ownership_changes {
                  value = $ownership_changes + 1
                }
              
                var.update $new_leads_created {
                  value = $new_leads_created + 1
                }
              
                db.add p_touchpoints {
                  data = {
                    lead      : $lead_id
                    channel   : "import"
                    note      : "Ownership change — previous owner: " ~ $existing_lead.full_name
                    created_by: "system"
                  }
                }
              }
            
              else {
                db.edit b_farm_leads {
                  field_name = "id"
                  field_value = $existing_lead.id
                  data = {
                    do_not_mail      : $do_not_mail
                    owner2_first_name: $owner2_first
                    owner2_last_name : $owner2_last
                  }
                } as $lead
              
                var.update $lead_id {
                  value = $existing_lead.id
                }
              
                var.update $existing_leads_updated {
                  value = $existing_leads_updated + 1
                }
              }
            }
          }
        }
      
        var $years_owned {
          value = null
        }
      
        var $equity_percent {
          value = null
        }
      
        conditional {
          if (($row["Est. Value"]|to_decimal) > 0) {
            var.update $equity_percent {
              value = (($row["Est. Equity"]|to_decimal) / ($row["Est. Value"]|to_decimal)) * 100
            }
          }
        }
      
        var $prop_type {
          value = "single_family"
        }
      
        conditional {
          if ($row["Property Type"] == "Condominium") {
            var.update $prop_type {
              value = "condo"
            }
          }
        
          elseif ($row["Property Type"] == "Townhouse") {
            var.update $prop_type {
              value = "townhouse"
            }
          }
        
          elseif ($row["Property Type"] == "Multi-Family") {
            var.update $prop_type {
              value = "multi_family"
            }
          }
        
          elseif ($row["Property Type"] == "Vacant Land") {
            var.update $prop_type {
              value = "land"
            }
          }
        }
      
        conditional {
          if ($mode == "INSERT") {
            db.add e_farm_properties {
              data = {
                lead            : $lead_id
                address_line1   : $row.Address
                address_city    : $row.City
                address_state   : $row.State
                address_zip     : $row.Zip
                property_type   : $prop_type
                estimated_value : $row["Est. Value"]|to_decimal
                last_sale_price : $row["Last Sale Amount"]|to_decimal
                last_sale_date  : null
                year_built      : $row["Effective Year Built"]|to_int
                bedrooms        : $row.Bedrooms|to_int
                bathrooms       : $row["Total Bathrooms"]|to_decimal
                sqft            : $row["Building Sqft"]|to_int
                lot_size_sqft   : $row["Lot Size Sqft"]|to_int
                years_owned     : $years_owned
                estimated_equity: $row["Est. Equity"]|to_decimal
                equity_percent  : $equity_percent
                mortgage_balance: $row["Est. Remaining balance of Open Loans"]|to_decimal
                data_source     : "propstream"
                farm_area_name  : $area_name
                apn             : $row.APN
                assessed_value  : $row["Total Assessed Value"]|to_decimal
              }
            } as $property
          }
        
          else {
            db.edit e_farm_properties {
              field_name = "id"
              field_value = $existing_property.id
              data = {
                lead            : $lead_id
                property_type   : $prop_type
                estimated_value : $row["Est. Value"]|to_decimal
                last_sale_price : $row["Last Sale Amount"]|to_decimal
                last_sale_date  : null
                year_built      : $row["Effective Year Built"]|to_int
                bedrooms        : $row.Bedrooms|to_int
                bathrooms       : $row["Total Bathrooms"]|to_decimal
                sqft            : $row["Building Sqft"]|to_int
                lot_size_sqft   : $row["Lot Size Sqft"]|to_int
                years_owned     : $years_owned
                estimated_equity: $row["Est. Equity"]|to_decimal
                equity_percent  : $equity_percent
                mortgage_balance: $row["Est. Remaining balance of Open Loans"]|to_decimal
                farm_area_name  : $area_name
                assessed_value  : $row["Total Assessed Value"]|to_decimal
              }
            } as $property
          }
        }
      
        var $emails_to_check {
          value = [
            {email: $row["Email 1"], owner_number: 1}
            {email: $row["Email 2"], owner_number: 1}
            {email: $row["Email 3"], owner_number: 2}
            {email: $row["Email 4"], owner_number: 2}
          ]
        }
      
        foreach ($emails_to_check) {
          each as $email_item {
            conditional {
              if (($email_item.email|is_empty) == false) {
                db.query c_lead_emails {
                  where = $db.c_lead_emails.lead == $lead_id && $db.c_lead_emails.email == $email_item.email
                  return = {type: "single"}
                } as $existing_email
              
                conditional {
                  if ($existing_email == null) {
                    db.add c_lead_emails {
                      data = {
                        lead        : $lead_id
                        email       : $email_item.email
                        owner_number: $email_item.owner_number
                        email_status: "unknown"
                        is_primary  : false
                        source      : "propstream"
                      }
                    } as $new_email
                  
                    var.update $new_emails_added {
                      value = $new_emails_added + 1
                    }
                  }
                }
              }
            }
          }
        }
      
        db.query c_lead_emails {
          where = $db.c_lead_emails.lead == $lead_id
          return = {type: "list"}
        } as $all_emails
      
        conditional {
          if (($all_emails|count) > 0) {
            var $has_primary_email {
              value = $all_emails|some:$$.is_primary==true
            }
          
            conditional {
              if ($has_primary_email == false) {
                db.edit c_lead_emails {
                  field_name = "id"
                  field_value = ($all_emails|first).id
                  data = {is_primary: true}
                } as $updated_primary_email
              }
            }
          }
        }
      
        var $phones_to_check {
          value = [
            {phone: $row["Phone 1"], type: $row["Phone 1 Type"], dnc: $row["Phone 1 DNC"]}
            {phone: $row["Phone 2"], type: $row["Phone 2 Type"], dnc: $row["Phone 2 DNC"]}
            {phone: $row["Phone 3"], type: $row["Phone 3 Type"], dnc: $row["Phone 3 DNC"]}
            {phone: $row["Phone 4"], type: $row["Phone 4 Type"], dnc: $row["Phone 4 DNC"]}
            {phone: $row["Phone 5"], type: $row["Phone 5 Type"], dnc: $row["Phone 5 DNC"]}
          ]
        }
      
        foreach ($phones_to_check) {
          each as $phone_obj {
            conditional {
              if ($phone_obj.phone != null && $phone_obj.phone != "") {
                var $phone_type {
                  value = "unknown"
                }
              
                conditional {
                  if ($phone_obj.type == "Cell") {
                    var.update $phone_type {
                      value = "mobile"
                    }
                  }
                
                  elseif ($phone_obj.type == "Landline") {
                    var.update $phone_type {
                      value = "landline"
                    }
                  }
                
                  elseif ($phone_obj.type == "VOIP") {
                    var.update $phone_type {
                      value = "voip"
                    }
                  }
                }
              
                var $dnc {
                  value = ($phone_obj.dnc == "Public DNC") ? true : false
                }
              
                var $phone_text {
                  value = $phone_obj.phone|to_text
                }
              
                db.query d_lead_phone_numbers {
                  where = $db.d_lead_phone_numbers.lead == $lead_id && $db.d_lead_phone_numbers.phone == $phone_text
                  return = {type: "single"}
                } as $existing_phone
              
                conditional {
                  if ($existing_phone == null) {
                    db.add d_lead_phone_numbers {
                      data = {
                        lead       : $lead_id
                        phone      : $phone_text
                        phone_type : $phone_type
                        do_not_call: $dnc
                        source     : "propstream"
                      }
                    } as $new_phone
                  
                    var.update $new_phones_added {
                      value = $new_phones_added + 1
                    }
                  }
                
                  else {
                    db.edit d_lead_phone_numbers {
                      field_name = "id"
                      field_value = $existing_phone.id
                      data = {do_not_call: $dnc}
                    } as $updated_phone
                  }
                }
              }
            }
          }
        }
      
        db.query d_lead_phone_numbers {
          where = $db.d_lead_phone_numbers.lead == $lead_id
          return = {type: "list"}
        } as $all_phones
      
        conditional {
          if (($all_phones|count) > 0) {
            var $has_primary_phone {
              value = $all_phones|some:$$.is_primary==true
            }
          
            conditional {
              if ($has_primary_phone == false) {
                db.edit d_lead_phone_numbers {
                  field_name = "id"
                  field_value = ($all_phones|first).id
                  data = {is_primary: true}
                } as $updated_primary_phone
              }
            }
          }
        }
      
        db.add p_touchpoints {
          data = {
            lead      : $lead_id
            channel   : "import"
            note      : "PropStream import — " ~ $area_name
            created_by: "system"
          }
        } as $import_touchpoint
      }
    }
  }

  response = {
    total_rows_processed      : $total_rows_processed
    new_leads_created         : $new_leads_created
    existing_leads_updated    : $existing_leads_updated
    ownership_changes_detected: $ownership_changes
    new_emails_added          : $new_emails_added
    new_phones_added          : $new_phones_added
    rows_skipped              : $rows_skipped
    skipped_log               : $skipped_log
  }
}