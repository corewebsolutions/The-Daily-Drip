// Edit tiara_east record
query "tiara_east/{tiara_east_id}" verb=PATCH {
  api_group = "Utility"

  input {
    uuid tiara_east_id?
    dblink {
      table = "tiara_east"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch tiara_east {
      field_name = "id"
      field_value = $input.tiara_east_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $tiara_east
  }

  response = $tiara_east
}