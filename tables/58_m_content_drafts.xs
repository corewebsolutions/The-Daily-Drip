// Manages marketing content drafts (e.g., blog, LinkedIn) for neighborhoods.
table m_content_drafts {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // References the neighborhood for which this content is drafted.
    int neighborhood? {
      table = "a_neighborhoods"
    }
  
    // The week for which the content is planned.
    date week_of?
  
    // Draft text for a blog post.
    text blog_draft? filters=trim
  
    // Draft text for a LinkedIn post.
    text linkedin_draft? filters=trim
  
    // JSON field for storing market data relevant to the content, can be null.
    json market_data?
  
    // Status of the blog draft (e.g., pending_review, published), defaults to 'pending_review'.
    enum blog_status? {
      values = ["pending_review", "approved", "published", "rejected"]
    }
  
    // Status of the LinkedIn draft (e.g., pending_review, scheduled), defaults to 'pending_review'.
    enum linkedin_status? {
      values = ["pending_review", "approved", "scheduled", "rejected"]
    }
  
    // URL where the blog post was published, can be null.
    text blog_published_url? filters=trim
  
    // Timestamp when the LinkedIn post is scheduled to publish, can be null.
    timestamp linkedin_scheduled_at?
  
    // Notes from a content reviewer, can be null.
    text reviewer_notes? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}