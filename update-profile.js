document.addEventListener('DOMContentLoaded', function () {
    
  const memberType = localStorage.getItem('memberType');

  // Show extra fields if Thought Leader
  if (memberType === 'Thought Leader') {
    document.getElementById('thought-leader-extra-fields').style.display = 'block';
  }

  // Function to populate form fields
  function populateFormFields(userData) {
    // General fields
    $("#First-Name-2").val(userData.first_name);
    $("#Last-Name-2").val(userData.last_name);
    $("#Company-Name-2").val(userData.company_name);
    $("#Industry-2").val(userData.industry);
    $("#Self-Employed-2").val(userData.self_employed);
    $("#Years-Practicing-2").val(userData.years_practicing);
    $("#City-2").val(userData.city);
    $("#State-2").val(userData.state);
    $("#Email-2").val(userData.email);

    // Thought Leader only
    if (memberType === 'Thought Leader') {
      $("#job-title-2").val(userData.job_title);
      $("#Bio-2").val(userData.bio);
      $("#Linkedin-2").val(userData.linkedin);
      $("#Twitter-2").val(userData.twitter);
      $("#Instagram-2").val(userData.instagram);
      $("#Facebook-2").val(userData.facebook);
    }
  }

  // Function to fetch user data
  function fetchUserData() {
    const submitButton = $("#update_profile-form input[type='submit']");
    submitButton.val("Loading profile...").prop('disabled', true);

    $.ajax({
      url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/get_user",
      type: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("authToken")
      },
      success: function (response) {
        populateFormFields(response);
        submitButton.val("Update Profile").prop('disabled', false);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching user data:", error);
        console.error("Response:", xhr.responseText);
        alert("Could not load your profile. Please try again later.");
        submitButton.val("Update Profile").prop('disabled', false);
      }
    });
  }

  // Initial fetch when page loads
  fetchUserData();

  // Form submit handler
  $("#update_profile-form").submit(function (e) {
    e.preventDefault();

    const submitButton = $(this).find("input[type='submit']");
    submitButton.val("Updating...").prop('disabled', true);

    // Gather form data
    const formData = {
      first_name: $("#First-Name-2").val(),
      last_name: $("#Last-Name-2").val(),
      company_name: $("#Company-Name-2").val(),
      industry: $("#Industry-2").val(),
      self_employed: $("#Self-Employed-2").val(),
      years_practicing: $("#Years-Practicing-2").val(),
      city: $("#City-2").val(),
      state: $("#State-2").val(),
      email: $("#Email-2").val()
    };

    // Add Thought Leader fields if applicable
    if (memberType === "Thought Leader") {
      formData.job_title = $("#job-title-2").val();
      formData.bio = $("#Bio-2").val();
      formData.linkedin = $("#Linkedin-2").val();
      formData.twitter = $("#Twitter-2").val();
      formData.instagram = $("#Instagram-2").val();
      formData.facebook = $("#Facebook-2").val();
    }

    // Send update
    $.ajax({
      url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/update_profile",
      type: "POST",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("authToken")
      },
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: function (response) {
        alert("Profile updated successfully!");
        submitButton.val("Update Profile").prop('disabled', false);

        // Optional: update localStorage
        localStorage.setItem("firstName", formData.first_name);
        localStorage.setItem("lastName", formData.last_name);
        localStorage.setItem("email", formData.email);
      },
      error: function (xhr, status, error) {
        console.error("Error updating profile:", error);
        console.error("Response:", xhr.responseText);
        alert("Could not update your profile. Please try again later.");
        submitButton.val("Update Profile").prop('disabled', false);
      }
    });
  });
});
