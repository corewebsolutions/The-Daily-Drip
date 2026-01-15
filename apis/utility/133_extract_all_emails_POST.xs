// Extract all emails from CSV and create a single column CSV
query extract_all_emails verb=POST {
  api_group = "Utility"

  input {
    // CSV file containing contact information
    file csv_file
  }

  stack {
    // Initialize an empty array to store all emails
    var $all_emails {
      value = []
    }
  
    // Parse the uploaded CSV file
    stream.from_csv {
      value = $input.csv_file
      separator = ","
      enclosure = '"'
      escape_char = '"'
    } as $csv_rows
  
    // Iterate through each row of the CSV
    foreach ($csv_rows) {
      each as $row {
        // Check and add Email 1 if it exists and is not empty
        var $email1 {
          value = $row["Email 1"]|trim
        }
      
        conditional {
          if ($email1 != "") {
            array.push $all_emails {
              value = $email1
            }
          }
        }
      
        // Check and add Email 2 if it exists and is not empty
        var $email2 {
          value = $row["Email 2"]|trim
        }
      
        conditional {
          if ($email2 != "") {
            array.push $all_emails {
              value = $email2
            }
          }
        }
      
        // Check and add Email 3 if it exists and is not empty
        var $email3 {
          value = $row["Email 3"]|trim
        }
      
        conditional {
          if ($email3 != "") {
            array.push $all_emails {
              value = $email3
            }
          }
        }
      
        // Check and add Email 4 if it exists and is not empty
        var $email4 {
          value = $row["Email 4"]|trim
        }
      
        conditional {
          if ($email4 != "") {
            array.push $all_emails {
              value = $email4
            }
          }
        }
      }
    }
  }

  response = $all_emails
}