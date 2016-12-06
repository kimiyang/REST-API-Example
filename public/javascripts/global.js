// Userlst data array for filling in info box
var userListData = [];

//DOM ready
$(document).ready(function(){
  //populate the user table on initial page load
  populateTable();
  //username link click
  $('#userList table tbody').on('click','td a.linkshowuser', showUserInfo);
  $('#btnAddUser').on('click', addUser);
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
})

//functions

//fill table with data
function populateTable(){
  var tableContent = '';
  $.getJSON('/users/userlist',function(data){
    userListData = data;
    //for each item in json, add a table row and cell to the content string
    $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
          });
    $('#userList table tbody').html(tableContent);
  });
}

function showUserInfo(event){
  //prevent link from firing
  event.preventDefault();

  //retrive username from link rel attribute
  let thisUserName = $(this).attr('rel');

  //get index of object based on id value
  let arrayPosition = userListData.map((item) => item.username).indexOf(thisUserName);

  //gt user object
  let thisUserObject = userListData[arrayPosition];

  //populate info box
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);
}

//add user
function addUser(event){
  event.preventDefault();
  var errorCount = 0;
  $('#addUser input').each(function(index, val){
    if($(this).val === ''){errorCount++}
  })

  if(errorCount === 0){
    let newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    }

    //using ajax to post user info
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function(response){
      if(response.msg === ''){
        $('#addUser fieldset input').val('');
        populateTable();
      }
      else{
        alert('Error:' + response.msg);
      }
    });
  }
  else{
    alert('Please fill in all fields');
    return false;
  }
}

function deleteUser(event){
  event.preventDefault();
  let confirmation = confirm('Are you sure to delete the user');
  //let confirmation = true;
  if(confirmation === true){
    console.log('about to del');
    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/'+$(this).attr('rel')
    }).done(function(response){
      if(response.msg === ''){
        console.log('no error');
      }
      else{
        alert('Error: ' + response.msg);
      }
      populateTable();
    });
  }
  else{
    return false;
  }
}
