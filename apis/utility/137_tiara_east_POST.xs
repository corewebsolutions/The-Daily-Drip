// Add tiara_east record
query tiara_east verb=POST {
  api_group = "Utility"

  input {
    dblink {
      table = "tiara_east"
    }
  }

  stack {
    db.add tiara_east {
      data = {created_at: "now"}
    } as $tiara_east
  }

  response = $tiara_east
}