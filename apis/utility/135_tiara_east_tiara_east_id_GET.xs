// Get tiara_east record
query "tiara_east/{tiara_east_id}" verb=GET {
  api_group = "Utility"

  input {
    uuid tiara_east_id?
  }

  stack {
    db.get tiara_east {
      field_name = "id"
      field_value = $input.tiara_east_id
    } as $tiara_east
  
    precondition ($tiara_east != null) {
      error_type = "notfound"
      error = "Not Found."
    }
  }

  response = $tiara_east
}