
document.addEventListener("DOMContentLoaded", function () {
  const $form = $("#bulk-text-form");
  const $successMessage = $(".bulk-text-success");
  const $submitButton = $form.find('button[type="submit"]');

  const verifyEndpoint =
    "https://xxdy-xbul-g3ez.n7d.xano.io/api:ZFCMxBnL/verify_sender_bulk_text";

  const massTextEndpoint =
    "https://xxdy-xbul-g3ez.n7d.xano.io/api:ZFCMxBnL/mass-text";

  const homePageUrl = "/";
  const authToken = localStorage.getItem("authToken");

  // Hide the form until the user is authenticated and authorized
  $form.hide();
  $successMessage.hide();

  /*
   * ==========================================
   * VERIFY PAGE ACCESS
   * ==========================================
   */

  if (!authToken) {
    
    alert("You must be logged in to access this page.");
    window.location.replace(homePageUrl);
    return;
  }

  $.ajax({
    url: verifyEndpoint,
    method: "GET",
    dataType: "json",

    headers: {
      Authorization: "Bearer " + authToken
    },

    success: function (response) {
      console.log("Bulk text access response:", response);

      if (response && response.can_send_mass_texts === true) {
        // User is authenticated and has permission
        $form.show();
        return;
      }

      // User is authenticated but does not have permission
      alert("You do not have permission to access this page.");
      window.location.replace(homePageUrl);
    },

    error: function (xhr, status, error) {
      console.error("Bulk text access verification failed:", {
        status: status,
        error: error,
        response: xhr.responseJSON || xhr.responseText
      });

      if (xhr.status === 401) {
        localStorage.removeItem("authToken");

        alert("Your session has expired. Please log in again.");
      } else {
        alert("You do not have permission to access this page.");
      }

      window.location.replace(homePageUrl);
    }
  });

  /*
   * ==========================================
   * SUBMIT BULK TEXT FORM
   * ==========================================
   */

  $form.on("submit", function (event) {
    event.preventDefault();

    const currentAuthToken = localStorage.getItem("authToken");
    const group = $("#group").val();
    const message = $("#message").val().trim();

    if (!group) {
      alert("Please select a recipient group.");
      return;
    }

    if (!message) {
      alert("Please enter a text message.");
      return;
    }

    if (!currentAuthToken) {
      alert("Your session has expired. Please log in again.");
      window.location.replace(homePageUrl);
      return;
    }

    const originalButtonText = $submitButton.text();
    const waitingText =
      $submitButton.attr("data-wait") || "Please wait...";

    $submitButton
      .prop("disabled", true)
      .text(waitingText);

    $successMessage.hide();

    $.ajax({
      url: massTextEndpoint,
      method: "POST",
      contentType: "application/json",
      dataType: "json",

      headers: {
        Authorization: "Bearer " + currentAuthToken
      },

      data: JSON.stringify({
        group: group,
        message: message
      }),

      success: function (response) {
        console.log("Mass text response:", response);

        // Reset dropdown and message
        $form[0].reset();

        // Show custom success message
        $successMessage
          .stop(true, true)
          .css("display", "flex");

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

        if (xhr.status === 401) {
          localStorage.removeItem("authToken");

          alert("Your session has expired. Please log in again.");
          window.location.replace(homePageUrl);
          return;
        }

        if (xhr.status === 403) {
          alert("You do not have permission to send bulk text messages.");
          window.location.replace(homePageUrl);
          return;
        }

        const errorMessage =
          xhr.responseJSON?.message ||
          "Something went wrong while sending the text messages.";

        alert(errorMessage);
      },

      complete: function () {
        $submitButton
          .prop("disabled", false)
          .text(originalButtonText);
      }
    });
  });
});
