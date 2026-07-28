// Stores details about voicemail recordings used in campaigns.
table k_voicemail_recording {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // References the campaign associated with this voicemail recording, can be null.
    int? campaign? {
      table = "f_campaigns"
    }
  
    // A descriptive label for the recording.
    text recording_label? filters=trim
  
    // URL to the audio file of the voicemail recording.
    text audio_url? filters=trim
  
    // Duration of the recording in seconds, can be null.
    int? duration_seconds?
  
    // Transcription or script text of the voicemail, can be null.
    text? script_text? filters=trim
  
    // Timestamp when the voicemail was recorded, can be null.
    timestamp recorded_at?
  
    int? touchpoint_id? {
      table = "g_campaign_touchpoints"
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}