document.addEventListener('DOMContentLoaded', function () {

       // Initial call to populate form
       fetchUserData();
    
    const memberType = localStorage.getItem('memberType');

    // Show additional fields if user is a Thought Leader
    if (memberType === 'Thought Leader') {
      $('#thought-leader-extra-fields').show();
    }
  
    // Populate form fields
    function populateFormFields(user) {
      $('#First-Name-2').val(user.first_name);
      $('#Last-Name-2').val(user.last_name);
      $('#Company-Name-2').val(user.company_name);
      $('#Industry-2').val(user.industry);
      $('#Self-Employed-2').val(user.self_employed);
      $('#Years-Practicing-2').val(user.years_practicing);
      $('#City-2').val(user.city);
      $('#State-2').val(user.state);
      $('#Email-2').val(user.email);
  
      if (memberType === 'Thought Leader') {
        $('#job-title-2').val(user.job_title);
        $('#Bio-2').val(user.bio);
        $('#Linkedin-2').val(user.linkedin);
        $('#Twitter-2').val(user.twitter);
        $('#Instagram-2').val(user.instagram);
        $('#Facebook-2').val(user.facebook);
      }
    }
  
    // Fetch user data from API
    function fetchUserData() {
      const $submitBtn = $('#update_profile-form input[type="submit"]');
      $submitBtn.val('Loading profile...').prop('disabled', true);
  
      $.ajax({
        url: 'https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/get_user',
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        success: function (response) {
          populateFormFields(response);
          $submitBtn.val('Update Profile').prop('disabled', false);
        },
        error: function (xhr) {
          console.error('Error fetching user data:', xhr.responseText);
          alert('Could not load your profile. Please try again later.');
          $submitBtn.val('Update Profile').prop('disabled', false);
        },
      });
    }
  
    // Handle form submission
    $('#update_profile-form').on('submit', function (e) {
      e.preventDefault();
  
      const $submitBtn = $(this).find('input[type="submit"]');
      $submitBtn.val('Updating...').prop('disabled', true);
  
      const formData = {
        first_name: $('#First-Name-2').val(),
        last_name: $('#Last-Name-2').val(),
        company_name: $('#Company-Name-2').val(),
        industry: $('#Industry-2').val(),
        self_employed: $('#Self-Employed-2').val(),
        years_practicing: $('#Years-Practicing-2').val(),
        city: $('#City-2').val(),
        state: $('#State-2').val(),
        email: $('#Email-2').val(),
      };
  
      if (memberType === 'Thought Leader') {
        formData.job_title = $('#job-title-2').val();
        formData.bio = $('#Bio-2').val();
        formData.linkedin = $('#Linkedin-2').val();
        formData.twitter = $('#Twitter-2').val();
        formData.instagram = $('#Instagram-2').val();
        formData.facebook = $('#Facebook-2').val();
      }
  
      $.ajax({
        url: 'https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/update_profile',
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: function () {
          alert('Profile updated successfully!');
          $submitBtn.val('Update Profile').prop('disabled', false);
  
          // Optional: update local storage
          localStorage.setItem('firstName', formData.first_name);
          localStorage.setItem('lastName', formData.last_name);
          localStorage.setItem('email', formData.email);
        },
        error: function (xhr) {
          console.error('Error updating profile:', xhr.responseText);
          alert('Could not update your profile. Please try again later.');
          $submitBtn.val('Update Profile').prop('disabled', false);
        },
      });
    });
  

});
