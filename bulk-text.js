
document.addEventListener('DOMContentLoaded', function() {


  const $form = $("#bulk-text-form");
  const $successMessage = $(".bulk-text-success");
  const $errorMessage = $form.siblings(".w-form-fail");
  const $submitButton = $form.find('input[type="submit"]');

  const endpoint =
    "https://xxdy-xbul-g3ez.n7d.xano.io/api:ZFCMxBnL/mass-text";

  // Keep custom messages hidden initially
  $successMessage.hide();
  $errorMessage.hide();

  $form.on("submit", function (event) {
    event.preventDefault();

    const authToken = localStorage.getItem("authToken");
    const group = $("#group").val();
    const message = $("#message").val().trim();

    // Basic frontend validation
    if (!group) {
      alert("Please select a recipient group.");
      return;
    }

    if (!message) {
      alert("Please enter a text message.");
      return;
    }

    if (!authToken) {
      alert("Your session has expired. Please log in again.");
      return;
    }

    const originalButtonText = $submitButton.val();

    $submitButton
      .prop("disabled", true)
      .val($submitButton.attr("data-wait") || "Please wait...");

    $successMessage.hide();
    $errorMessage.hide();

    $.ajax({
      url: endpoint,
      method: "POST",
      contentType: "application/json",
      dataType: "json",

      headers: {
        Authorization: "Bearer " + authToken
      },

      data: JSON.stringify({
        group: group,
        message: message
      }),

      success: function (response) {
        console.log("Mass text response:", response);

        // Reset the form after successful submission
        $form[0].reset();

        // Show the custom success message
        $successMessage.stop(true, true).css("display", "block");

        // Hide it again after 3 seconds
        setTimeout(function () {
          $successMessage.fadeOut();
        }, 3000);
      },

      error: function (xhr, status, error) {
        console.error("Mass text request failed:", {
          status: status,
          error: error,
          response: xhr.responseJSON || xhr.responseText
        });

        let errorText = "Something went wrong while sending the text messages.";

        if (xhr.status === 401) {
          errorText = "Your session has expired. Please log in again.";
        } else if (xhr.responseJSON?.message) {
          errorText = xhr.responseJSON.message;
        }

        $errorMessage
          .find("div")
          .first()
          .text(errorText);

        $errorMessage.stop(true, true).css("display", "block");
      },

      complete: function () {
        $submitButton
          .prop("disabled", false)
          .val(originalButtonText);
      }
    });
  });
});
