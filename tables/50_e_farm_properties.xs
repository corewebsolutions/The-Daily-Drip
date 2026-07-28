// Stores property details associated with leads.
table e_farm_properties {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    text? farm_area_name? filters=trim
  
    // References the lead associated with this property.
    int? lead? {
      table = "b_farm_leads"
    }
  
    // References the neighborhood the property belongs to, can be null.
    int? neighborhood? {
      table = "a_neighborhoods"
    }
  
    // The first line of the property address.
    text address_line1? filters=trim
  
    // The city of the property address.
    text address_city? filters=trim
  
    // The state of the property address, defaults to 'FL'.
    text address_state? filters=trim
  
    // The ZIP code of the property address.
    text address_zip? filters=trim
  
    // Type of property (e.g., single_family, condo), defaults to 'single_family'.
    enum property_type?="single_family" {
      values = ["single_family", "condo", "townhouse", "multi_family", "land"]
    }
  
    // Estimated market value of the property, can be null.
    decimal? estimated_value?
  
    // Price of the last sale, can be null.
    decimal? last_sale_price?
  
    // Date of the last sale, can be null.
    date? last_sale_date?
  
    // Year the property was built, can be null.
    int? year_built?
  
    // Number of bedrooms, can be null.
    int? bedrooms?
  
    // Number of bathrooms, can be null.
    decimal bathrooms?
  
    // Square footage of the property, can be null.
    int? sqft?
  
    // Lot size in square feet, can be null.
    int? lot_size_sqft?
  
    // Number of years the current owner has owned the property, can be null.
    decimal? years_owned?
  
    // Estimated equity in the property, can be null.
    decimal? estimated_equity?
  
    // Estimated equity as a percentage, can be null.
    decimal? equity_percent?
  
    // Current mortgage balance, can be null.
    decimal? mortgage_balance?
  
    // Indicates if this is the primary property for the lead, defaults to true.
    bool? is_primary_property?
  
    // Source of the property data.
    enum data_source? {
      values = ["propstream", "attom", "manual"]
    }
  
    // Date when the property data was last refreshed, can be null.
    date? data_last_refreshed?
  
    // Timestamp of the last update to the property record.
    timestamp updated_at?
  
    text? apn? filters=trim
    decimal? assessed_value?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}