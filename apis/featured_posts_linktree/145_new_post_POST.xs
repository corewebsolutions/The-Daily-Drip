query new_post verb=POST {
  api_group = "featured_posts_linktree"

  input {
    text post_url? filters=trim
    text post_image? filters=trim
  }

  stack {
    db.add "" {
      data = {image_url: $input.post_image, post_url: $input.post_url}
    } as $featured_link
  }

  response = $featured_link
}