// Upload a CSV and filter rows based on unit numbers found in the Street Address.
query filter_units_from_csv verb=POST {
  api_group = "Utility"

  input {
    // CSV file containing a 'Street Address' column
    file csv_file
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
  
    // Initialize an empty array to store matching rows
    var $filtered_results {
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
          if ($target_units|in:$extracted_unit) {
            // Create a cleaned up record with only the fields you want
            var $cleaned_record {
              value = {
                "Street Address": $row["Street Address"],
                "First Name": $row["First Name"],
                "Last Name": $row["Last Name"],
                "Company Name": $row["Company Name"],
                "Email 1": $row["Email 1"],
                "Email 2": $row["Email 2"],
                "Email 3": $row["Email 3"],
                "Email 4": $row["Email 4"],
                "Phone 1": $row["Phone 1"],
                "Phone 2": $row["Phone 2"],
                "Phone 3": $row["Phone 3"],
                "Phone 4": $row["Phone 4"],
                "Phone 5": $row["Phone 5"]
              }
            }
          
            array.push $filtered_results {
              value = $cleaned_record
            }
          }
        }
      }
    }
  }

  response = $filtered_results
}