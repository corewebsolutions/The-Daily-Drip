document.addEventListener('DOMContentLoaded', function() {
  const authToken = localStorage.getItem("authToken");
  const isSignedIn = !!authToken;

  // If user is signed in, remove email + password fields from the form
  if (isSignedIn) {
    $('#Email-2').closest('.form__item').remove();
    $('#Password-2').closest('.form__item').remove();
  }

  // Handle form submission
  $("#community-member-signup").submit(function(e) {
    e.preventDefault();

    const submitButton = $(this).find('input[type="submit"]');
    const originalButtonText = submitButton.val();
    submitButton.val("Processing...").prop('disabled', true);

    // Collect form data
    const formData = {
      first_name: $("#First-Name-2").val(),
      last_name: $("#Last-Name-2").val(),
      company_name: $("#Company-Name-2").val(),
      industry: $("#Industry-2").val(),
      self_employed: $("#Self-Employed-2").val(),
      years_practicing: $("#Years-Practicing-2").val(),
      city: $("#City-2").val(),
      state: $("#State-2").val(),
      email: isSignedIn ? localStorage.getItem("email") : $("#Email-2").val()
    };

    if (!isSignedIn) {
      formData.password = $("#Password-2").val();
    }

    // Send data to Xano
    $.ajax({
      url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/create_community_member",
      type: "POST",
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: function(response) {
        localStorage.setItem("authToken", response.authToken);
        localStorage.setItem("memberType", response.user_info.member_type);
        localStorage.setItem("status", response.user_info.status);
        localStorage.setItem("firstName", response.user_info.first_name);
        localStorage.setItem("lastName", response.user_info.last_name);
        localStorage.setItem("email", response.user_info.email);
        window.location.href = response.checkoutUrl;
      },
      error: function(xhr, status, error) {
        console.error("Error:", error);
        alert("There was an error processing your request. Please try again.");
        submitButton.val(originalButtonText).prop('disabled', false);
      }
    });
  });
});