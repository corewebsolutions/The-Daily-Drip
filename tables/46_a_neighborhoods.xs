// Stores geographical data for neighborhoods.
table a_neighborhoods {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // Name of the neighborhood.
    text name? filters=trim
  
    // GeoJSON polygon representing the neighborhood boundaries.
    json polygon?
  
    // Bounding box coordinates for the neighborhood.
    json bounding_box?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}