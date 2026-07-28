query get_posts verb=GET {
  api_group = "featured_posts_linktree"

  input {
  }

  stack {
    db.query "" {
      sort = {featured_links.created_at: "asc"}
      return = {type: "list"}
    } as $posts
  }

  response = $posts
}