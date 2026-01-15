// Upload CSVs and add all target units to database (with or without valid emails)
query add_units_to_db verb=POST {
  api_group = "Utility"

  input {
    // CSV file containing contact information
    file contact_csv
  
    // CSV file containing valid emails
    file valid_emails_csv
  }

  stack {
    // Define the list of unit numbers to filter for
    var $target_units {
      value = [
        "722"
        "822"
        "922"
        "1022"
        "1222"
        "1422"
        "1622"
        "1722"
        "1822"
        "710"
        "810"
        "910"
        "1010"
        "1110"
        "1210"
        "1410"
        "1610"
        "1710"
        "1810"
      ]
    }
  
    // Parse the valid emails CSV and store all valid emails in an array
    var $valid_emails_list {
      value = []
    }
  
    stream.from_csv {
      value = $input.valid_emails_csv
      separator = ","
      enclosure = '"'
      escape_char = '"'
    } as $valid_email_rows
  
    foreach ($valid_email_rows) {
      each as $email_row {
        var $valid_email {
          value = $email_row.email|trim
        }
      
        conditional {
          if ($valid_email != "") {
            array.push $valid_emails_list {
              value = $valid_email
            }
          }
        }
      }
    }
  
    // Initialize array to store records to be inserted
    var $records_to_insert {
      value = []
    }
  
    // Parse the contact CSV file
    stream.from_csv {
      value = $input.contact_csv
      separator = ","
      enclosure = '"'
      escape_char = '"'
    } as $csv_rows
  
    // Iterate through each row of the CSV
    foreach ($csv_rows) {
      each as $row {
        // Get the street address and trim it
        var $street_address {
          value = $row["Street Address"]
        }
      
        // Split by # to get the part after it
        var $split_by_hash {
          value = $street_address|split:"#"
        }
      
        // Get the second part (after the #) and trim it thoroughly
        var $extracted_unit {
          value = $split_by_hash[1]|trim
        }
      
        // Check if the extracted unit is in our target list
        conditional {
          if ($extracted_unit|in:$target_units) {
            // Collect all valid emails for this contact
            var $contact_valid_emails {
              value = []
            }
          
            // Check Email 1
            var $email1 {
              value = $row["Email 1"]|trim
            }
          
            conditional {
              if ($email1 != "" && ($valid_emails_list|in:$email1)) {
                array.push $contact_valid_emails {
                  value = $email1
                }
              }
            }
          
            // Check Email 2
            var $email2 {
              value = $row["Email 2"]|trim
            }
          
            conditional {
              if ($email2 != "" && ($valid_emails_list|in:$email2)) {
                array.push $contact_valid_emails {
                  value = $email2
                }
              }
            }
          
            // Check Email 3
            var $email3 {
              value = $row["Email 3"]|trim
            }
          
            conditional {
              if ($email3 != "" && ($valid_emails_list|in:$email3)) {
                array.push $contact_valid_emails {
                  value = $email3
                }
              }
            }
          
            // Check Email 4
            var $email4 {
              value = $row["Email 4"]|trim
            }
          
            conditional {
              if ($email4 != "" && ($valid_emails_list|in:$email4)) {
                array.push $contact_valid_emails {
                  value = $email4
                }
              }
            }
          
            // Collect all phone numbers
            var $phone_numbers {
              value = []
            }
          
            // Phone 1
            var $phone1 {
              value = $row["Phone 1"]|trim
            }
          
            conditional {
              if ($phone1 != "") {
                array.push $phone_numbers {
                  value = {number: $row["Phone 1"], dnc: $row["Phone 1 DNC"]}
                }
              }
            }
          
            // Phone 2
            var $phone2 {
              value = $row["Phone 2"]|trim
            }
          
            conditional {
              if ($phone2 != "") {
                array.push $phone_numbers {
                  value = {number: $row["Phone 2"], dnc: $row["Phone 2 DNC"]}
                }
              }
            }
          
            // Phone 3
            var $phone3 {
              value = $row["Phone 3"]|trim
            }
          
            conditional {
              if ($phone3 != "") {
                array.push $phone_numbers {
                  value = {number: $row["Phone 3"], dnc: $row["Phone 3 DNC"]}
                }
              }
            }
          
            // Phone 4
            var $phone4 {
              value = $row["Phone 4"]|trim
            }
          
            conditional {
              if ($phone4 != "") {
                array.push $phone_numbers {
                  value = {number: $row["Phone 4"], dnc: $row["Phone 4 DNC"]}
                }
              }
            }
          
            // Phone 5
            var $phone5 {
              value = $row["Phone 5"]|trim
            }
          
            conditional {
              if ($phone5 != "") {
                array.push $phone_numbers {
                  value = {number: $row["Phone 5"], dnc: $row["Phone 5 DNC"]}
                }
              }
            }
          
            // Add to list regardless of whether there are valid emails
            array.push $records_to_insert {
              value = {
                first_name    : $row["First Name"]|trim
                last_name     : $row["Last Name"]|trim
                street_address: $row["Street Address"]|trim
                emails        : $contact_valid_emails
                phone_numbers : $phone_numbers
              }
            }
          }
        }
      }
    }
  
    // Insert all records into the tiara_east database
    var $inserted_records {
      value = []
    }
  
    foreach ($records_to_insert) {
      each as $record {
        var $created_record {
          value = ```
            db.tiara_east.create {
                        content = $record
                      }
            ```
        }
      
        array.push $inserted_records {
          value = $created_record
        }
      }
    }
  }

  response = {
    message               : "Successfully added records to tiara_east database"
    total_records_prepared: $records_to_insert|count
    total_records_inserted: $inserted_records|count
    inserted_records      : $inserted_records
  }
}