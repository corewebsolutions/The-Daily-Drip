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
    $('#First-Name-2').val(user.first_name || '');
    $('#Last-Name-2').val(user.last_name || '');
    $('#Company-Name-2').val(user.company_name || '');
    $('#job-title-2').val(user.job_title || '');
    $('#Industry-2').val(user.industry || '');
    $('#Self-Employed-2').val(user.self_employed || '');
    $('#Years-Practicing-2').val(user.years_practicing || '');
    $('#City-2').val(user.city || '');
    $('#State-2').val(user.state || '');
    $('#email').val(user.email || '');
    
    // Only populate if field exists
    if ($('#Linkedin-2').length) $('#Linkedin-2').val(user.linkedin || '');
    if ($('#Twitter-2').length) $('#Twitter-2').val(user.twitter || '');
    if ($('#Instagram-2').length) $('#Instagram-2').val(user.instagram || '');
    if ($('#Facebook-2').length) $('#Facebook-2').val(user.facebook || '');
    if ($('#Bio-2').length) $('#Bio-2').val(user.bio || '');
    if ($('#birthday').length) $('#birthday').val(user.birthday || '');
    if ($('#phone-2').length) $('#phone-2').val(user.phone_number || '');
    if ($('#mailing-street-3').length) $('#mailing-street-3').val(user.street_address || '');
    if ($('#mailing-street-2').length) $('#mailing-street-2').val(user.street_address_2 || '');
    if ($('#mailing-city-2').length) $('#mailing-city-2').val(user.mailing_city || '');
    if ($('#mailing-state-2').length) $('#mailing-state-2').val(user.mailing_state || '');
    if ($('#Website-2').length) $('#Website-2').val(user.website || '');
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

  // ---- URL Normalization Setup ---
  const validExtensions = ['.com', '.org', '.net', '.co', '.io', '.edu', '.gov', '.biz', '.info'];

  function hasValidExtension(url) {
    return validExtensions.some(ext => url.toLowerCase().includes(ext));
  }

  function normalizeUrl(url) {
    if (!url) return "";
    url = url.trim().replace(/\s+/g, "");
    if (/^https?:\/\//i.test(url) && hasValidExtension(url)) return url;
    if (/^www\./i.test(url) && hasValidExtension(url)) return `https://${url}`;
    if (/^[\w.-]+\.[a-z]{2,}/i.test(url) && hasValidExtension(url)) return `https://www.${url}`;
    return "";
  }

  $('#update_profile-form').on('submit', function (e) {
    e.preventDefault();

    // Validate social URL fields - ONLY if they exist
    const urlFields = [
      { selector: '#Linkedin-2', label: 'LinkedIn' },
      { selector: '#Twitter-2', label: 'Twitter' },
      { selector: '#Instagram-2', label: 'Instagram' },
      { selector: '#Facebook-2', label: 'Facebook' },
      { selector: '#Website-2', label: 'Website' }
    ];

    let hasError = false;
    let errorMessages = [];

    urlFields.forEach(({ selector, label }) => {
      const $field = $(selector);
      if ($field.length) {  // Check if field exists before accessing it
        const inputVal = $field.val();
        if (inputVal && inputVal.trim() && (inputVal.startsWith('@') || !hasValidExtension(inputVal))) {
          errorMessages.push(`${label} must be a full URL (not @username).`);
          hasError = true;
        }
      }
    });

    if (hasError) {
      alert(errorMessages.join('\n'));
      return;
    }

    // Normalize the fields after validation - ONLY if they exist
    urlFields.forEach(({ selector }) => {
      const $field = $(selector);
      if ($field.length) {
        const cleaned = normalizeUrl($field.val() || '');
        $field.val(cleaned);
      }
    });

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
      linkedin: $('#Linkedin-2').length ? $('#Linkedin-2').val() : null,
      twitter: $('#Twitter-2').length ? $('#Twitter-2').val() : null,
      instagram: $('#Instagram-2').length ? $('#Instagram-2').val() : null,
      facebook: $('#Facebook-2').length ? $('#Facebook-2').val() : null,
      profile_image: $('#field-2').length ? $('#field-2').val() : null,
      bio: $('#Bio-2').length ? $('#Bio-2').val() : null,
      birthday: $('#birthday').length ? $('#birthday').val() : null,
      phone_number: $('#phone-2').length ? $('#phone-2').val() : null,
      street_address: $('#mailing-street-3').length ? $('#mailing-street-3').val() : null,
      street_address_2: $('#mailing-street-2').length ? $('#mailing-street-2').val() : null,
      mailing_city: $('#mailing-city-2').length ? $('#mailing-city-2').val() : null,
      mailing_state: $('#mailing-state-2').length ? $('#mailing-state-2').val() : null,
      website: $('#Website-2').length ? $('#Website-2').val() : null,
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