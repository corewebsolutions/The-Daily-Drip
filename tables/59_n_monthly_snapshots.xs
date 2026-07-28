// Stores aggregated monthly market data for neighborhoods.
table n_monthly_snapshots {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // References the neighborhood for which the snapshot was taken.
    int neighborhood? {
      table = "a_neighborhoods"
    }
  
    // The month of the snapshot.
    date month?
  
    // Number of active listings in the neighborhood for the month.
    int active_count?
  
    // Average listing price for the month.
    decimal avg_list_price?
  
    // Average days on market, can be null.
    decimal avg_dom?
  
    // Number of properties sold for the month, can be null.
    int sold_count?
  
    // Average sale price for the month, can be null.
    decimal avg_sale_price?
  
    // Ratio of sale price to list price, can be null.
    decimal sale_to_list_ratio?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}