document.addEventListener('DOMContentLoaded', function () {
  // Custom Multi-Step Form with Validation using jQuery
  const $form = $('#sign-up-form');
  const $slides = $form.find('.w-slide');
  const $backButton = $('#go-back');
  const $nextButton = $('#next-button');
  const $submitButton = $('.submit-button');
  const $alertBox = $('#alert');

  let currentSlide = 0;

  function showSlide(index) {
    $slides.each(function (i) {
      const $slide = $(this);
      $slide.attr('aria-hidden', i !== index);
      $slide.css('display', i === index ? 'block' : 'none');
    });
    $('#current-slide').text(index + 1);
    $backButton.css({
      opacity: index > 0 ? '1' : '0',
      pointerEvents: index > 0 ? 'auto' : 'none',
    });

    $submitButton.css('display', index === $slides.length - 1 ? 'inline-block' : 'none');
    $nextButton.css('display', index === $slides.length - 1 ? 'none' : 'inline-block');
  }

  function validateCurrentSlide() {
    const $current = $slides.eq(currentSlide);
    const $requiredFields = $current.find('input[required], select[required], textarea[required]');
    let isValid = true;

    $requiredFields.each(function () {
      const $field = $(this);
      const value = $field.attr('type') === 'checkbox' ? $field.prop('checked') : $field.val().trim();
      if (!value) {
        $field.addClass('warning');
        isValid = false;
      } else {
        $field.removeClass('warning');
      }
    });

    if (!isValid) {
      $alertBox.text('Please complete all required fields on this step.').css({ opacity: '1', pointerEvents: 'auto' });
    } else {
      $alertBox.css({ opacity: '0', pointerEvents: 'none' });
    }

    return isValid;
  }

  $nextButton.on('click', function (e) {
    e.preventDefault();
    if (validateCurrentSlide()) {
      currentSlide++;
      showSlide(currentSlide);
    }
  });

  $backButton.on('click', function () {
    if (currentSlide > 0) {
      currentSlide--;
      showSlide(currentSlide);
    }
  });

  $form.on('submit', function (e) {
    e.preventDefault();

    if (!validateCurrentSlide()) return;

    const originalButtonText = $submitButton.val() || $submitButton.text();
    $submitButton.val('Processing...').text('Processing...').prop('disabled', true).css({
      opacity: '0.8',
      cursor: 'wait',
    });

    const isNonUS = $('#check-for-usa').is(':checked');
    const formData = {
      first_name: $('#first-name-2').val(),
      last_name: $('#last-name-2').val(),
      company_name: $('#company-name').val(),
      industry: $('#industry').val(),
      self_employed: $('#self-employed').val(),
      years_practicing: $('#years-practicing').val(),
      email: $('#email-3').val(),
      password: $('#password-signup').val(),
      city: isNonUS ? $('#city-global').val() : $('#city').val(),
      state: isNonUS ? $('#country-global').val() : $('#state').val(),
    };

    $.ajax({
      url: 'https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/create_subscriber',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function (response) {
        if (response.authToken) {
          localStorage.setItem('authToken', response.authToken);
        }
        if (response.user_info) {
          localStorage.setItem('memberType', 'Subscriber');
          localStorage.setItem('status', 'active');
          localStorage.setItem('firstName', response.user_info.first_name || formData.first_name);
          localStorage.setItem('lastName', response.user_info.last_name || formData.last_name);
          localStorage.setItem('email', response.user_info.email || formData.email);
        }

        $submitButton.val('Success!').text('Success!').css({
          opacity: '1',
          backgroundColor: '#4CAF50',
        });

        window.location.href = '/sign-up-confirmation';
      },
      error: function (xhr) {
        console.error(xhr.responseText);
        let errorMessage = 'There was an error creating your account. Please try again.';

        try {
          const res = JSON.parse(xhr.responseText);
          if (res.message) errorMessage = res.message;
        } catch (err) {
          // leave default
        }

        $alertBox.text(errorMessage).css({
          opacity: '1',
          pointerEvents: 'auto',
        });

        $submitButton.val(originalButtonText).text(originalButtonText).prop('disabled', false).css({
          opacity: '1',
          cursor: 'pointer',
          backgroundColor: '',
        });
      },
    });
  });

  // Toggle international vs US fields
  $('#check-for-usa').on('change', function () {
    const isChecked = $(this).is(':checked');

    if (isChecked) {
      $('#city-global, #country-global').css('display', 'block').attr('required', true);
      $('#city, #state').css('display', 'none').removeAttr('required');
    } else {
      $('#city-global, #country-global').css('display', 'none').removeAttr('required');
      $('#city, #state').css('display', 'block').attr('required', true);
    }
  });

  // Initialize
  showSlide(currentSlide);

  // Populate dynamic industries from CMS items
  $('.select-option').each(function () {
    var selectField = $(this).text();
    $('.select-field').append('<option value="' + selectField + '">' + selectField + '</option>');
  });
});