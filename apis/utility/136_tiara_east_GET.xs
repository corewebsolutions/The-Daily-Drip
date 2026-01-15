// Query all tiara_east records
query tiara_east verb=GET {
  api_group = "Utility"

  input {
  }

  stack {
    db.query tiara_east {
      return = {type: "list"}
    } as $tiara_east
  }

  response = $tiara_east
}