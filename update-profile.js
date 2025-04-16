document.addEventListener('DOMContentLoaded', function() {

    const memberType = localStorage.getItem("memberType");

    if (memberType !== "Thought Leader" && memberType !== "Thought Leader (Legacy)") {
      $('#Linkedin-2').closest('.form__item').remove();
      $('#Twitter-2').closest('.form__item').remove();
      $('#Instagram-2').closest('.form__item').remove();
      $('#Facebook-2').closest('.form__item').remove();
      $('#field-2').closest('.form__item').remove();
      $('.profile-pic-url').remove();
      $('#Bio-2').closest('.form__item').remove();
      $('#birthday').closest('.form__item').remove();
      $('#phone-2').closest('.form__item').remove();
      $('#mailing-street-3').closest('.form__item').remove();
      $('#mailing-street-2').closest('.form__item').remove();
      $('#mailing-city-2').closest('.form__item').remove();
      $('#mailing-state-2').closest('.form__item').remove();
      $('#Website-2').closest('.form__item').remove();
    }

    function populateFormFields(user) {
      $('#First-Name-2').val(user.first_name);
      $('#Last-Name-2').val(user.last_name);
      $('#Company-Name-2').val(user.company_name);
      $('#job-title-2').val(user.job_title);
      $('#Industry-2').val(user.industry);
      $('#Self-Employed-2').val(user.self_employed);
      $('#Years-Practicing-2').val(user.years_practicing);
      $('#City-2').val(user.city);
      $('#State-2').val(user.state);
      $('#email').val(user.email);
      $('#Linkedin-2').val(user.linkedin);
      $('#Twitter-2').val(user.twitter);
      $('#Instagram-2').val(user.instagram);
      $('#Facebook-2').val(user.facebook);
      //$('#field-2').val(user.profile_image);
      $('#Bio-2').val(user.bio);
      $('#birthday').val(user.birthday);
      $('#phone-2').val(user.phone_number);
      $('#mailing-street-3').val(user.street_address);
      $('#mailing-street-2').val(user.street_address_2);
      $('#mailing-city-2').val(user.mailing_city);
      $('#mailing-state-2').val(user.mailing_state);
      $('#Website-2').val(user.website);
    }

    function fetchUserData() {
      $.ajax({
        url: 'https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/get_user',
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        success: function (response) {
          populateFormFields(response);
        },
        error: function (xhr) {
          console.error('Error fetching user data:', xhr.responseText);
          alert('Session Expired, Please Login Again.');
          window.location.href = "/account-login";
        }
      });
    }

    fetchUserData();

    $('#update_profile-form').on('submit', function (e) {
      e.preventDefault();

      const $submitBtn = $(this).find('input[type="submit"]');
      const originalText = $submitBtn.val();
      $submitBtn.val('Updating...').prop('disabled', true);

      const formData = {
        first_name: $('#First-Name-2').val(),
        last_name: $('#Last-Name-2').val(),
        company_name: $('#Company-Name-2').val(),
        job_title: $('#job-title-2').val(),
        industry: $('#Industry-2').val(),
        self_employed: $('#Self-Employed-2').val(),
        years_practicing: $('#Years-Practicing-2').val(),
        city: $('#City-2').val(),
        state: $('#State-2').val(),
        email: $('#email').val(),
        linkedin: $('#Linkedin-2').val(),
        twitter: $('#Twitter-2').val(),
        instagram: $('#Instagram-2').val(),
        facebook: $('#Facebook-2').val(),
        profile_image: $('#field-2').val(),
        bio: $('#Bio-2').val(),
        birthday: $('#birthday').val(),
        phone_number: $('#phone-2').val(),
        street_address: $('#mailing-street-3').val(),
        street_address_2: $('#mailing-street-2').val(),
        mailing_city: $('#mailing-city-2').val(),
        mailing_state: $('#mailing-state-2').val(),
        website: $('#Website-2').val(),
        member_type: memberType
      };

      $.ajax({
        url: 'https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/update_profile',
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: function () {
          $submitBtn.val('Updated!');
          $('#alert-success').css('display', 'block').delay(3000).fadeOut();
          setTimeout(() => $submitBtn.val(originalText).prop('disabled', false), 2000);
        },
        error: function (xhr) {
          console.error('Error updating profile:', xhr.responseText);
          alert('Could not update your profile.');
          $submitBtn.val(originalText).prop('disabled', false);
        }
      });
    });
});