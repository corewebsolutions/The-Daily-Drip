// Delete tiara_east record.
query "tiara_east/{tiara_east_id}" verb=DELETE {
  api_group = "Utility"

  input {
    uuid tiara_east_id?
  }

  stack {
    db.del tiara_east {
      field_name = "id"
      field_value = $input.tiara_east_id
    }
  }

  response = null
}