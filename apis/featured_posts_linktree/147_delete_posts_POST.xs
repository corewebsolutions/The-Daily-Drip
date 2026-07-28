query delete_posts verb=POST {
  api_group = "featured_posts_linktree"

  input {
    text[] ids? filters=trim
  }

  stack {
    foreach ($input.ids) {
      each as $item {
        db.get "" {
          field_name = "id"
          field_value = $item
        } as $post
      
        conditional {
          if ($post != null) {
            var $image_url {
              value = $post.image_url
            }
          
            var $file_uuid {
              value = ""
            }
          
            conditional {
              if ($image_url != null && $image_url != "") {
                var $parts_after_domain {
                  value = $image_url|split:".net/"
                }
              
                conditional {
                  if (($parts_after_domain|count) > 1) {
                    var $path_part {
                      value = $parts_after_domain[1]
                    }
                  
                    var $path_segments {
                      value = $path_part|split:"/"
                    }
                  
                    conditional {
                      if (($path_segments|count) > 0) {
                        var $file_uuid {
                          value = $path_segments[0]
                        }
                      }
                    }
                  }
                }
              
                conditional {
                  if ($file_uuid != null && $file_uuid != "") {
                    api.request {
                      url = "https://api.uploadcare.com/files/UUID/storage/"|replace:"UUID":$file_uuid
                      method = "DELETE"
                      headers = []
                        |push:"Accept: application/vnd.uploadcare-v0.7+json"
                        |push:("Authorization: Uploadcare.Simple PUB:SEC"
                          |replace:"PUB":"a9377a61870bd8d61124"
                          |replace:"SEC":"d021143e06d095eecde3"
                        )
                    } as $uploadcare_delete_response
                  }
                }
              }
            }
          
            db.del "" {
              field_name = "id"
              field_value = $item
            }
          }
        }
      }
    }
  }

  response = {success: true, deleted_ids: $input.ids}
}