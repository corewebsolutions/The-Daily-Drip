table tiara_east {
  auth = false

  schema {
    uuid id
    timestamp created_at?=now
    text first_name? filters=trim
    text last_name? filters=trim
    json emails?
    json phone_numbers?
    text street_address? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}