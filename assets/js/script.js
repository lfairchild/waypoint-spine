WS = {
  ready: function(readyFunction) {
    if (document.attachEvent ?
        document.readyState === "complete" :
        document.readyState !== "loading") {
      readyFunction();
    }
    else {
      document.addEventListener('DOMContentLoaded', readyFunction);
    }
  },
  ajax: function(opts) {
    var request = new XMLHttpRequest();
    request.open(opts.method, opts.url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Accept', 'application/json');
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        opts.success(request.responseText);
      } else {
        opts.error();
      }
    };
    request.onerror = function() {
      opts.error();
    };
    request.send(JSON.stringify(opts.data));
  }
};

WS.ready(function() {
  var elements = document.querySelectorAll('.modal-open, .modal-close');
  Array.prototype.forEach.call(elements, function(element, index) {
    element.addEventListener('click', function(event) {
      document.getElementById('modal').classList.toggle('modal-hide');
      event.preventDefault();
    });
  });

  var element = document.getElementById('appointment-form');
  element.addEventListener('submit', function(event) {
    var name = document.getElementById('appointment-name');
    var phone = document.getElementById('appointment-phone');
    var comment = document.getElementById('appointment-comment');

    var errors = false;
    
    if (name.value.trim().length == 0) {
      name.labels[0].classList.add('error');
      errors = true;
    }
    else {
      name.labels[0].classList.remove('error');
    }
    
    if (phone.value.trim().length == 0) {
      phone.labels[0].classList.add('error');
      errors = true;
    }
    else {
      phone.labels[0].classList.remove('error');
    }
    
    if (!errors) {
      document.getElementById('appointment-submit').disabled = true;
      
      WS.ajax({        
        method: 'POST',
        url: element.action,
        data: {
          name: name.value,
          phone: phone.value,
          comment: comment.value
        },
        success: function() {
          document.getElementById('appointment-submit').disabled = false;
          document.getElementById('modal').classList.toggle('modal-hide');
          name.value = '';
          phone.value = '';
          comment.value = '';
        },
        error: function() {
          document.getElementById('appointment-submit').disabled = false;
        }
      });
    }
    
    event.preventDefault();
  });
});
