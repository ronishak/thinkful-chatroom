$(document).ready(function() {
    var socket = io();
    var input = $('input[name=message]');
    var messages = $('#messages');
    var users = $('#users');

    var totalUsers = function(num) {
      if (num < 2) {
        var text = ' user connected';
      } else {
        var text = ' users connected';
      }
      users.text(num + text);
    }

    var addMessage = function(message) {
      if(message.type === 'announcement') {
        messages.append('<div class=' +
          message.type + '><b>(' +
          message.time + ') ' +
          message.text + '</b></div>'
        );
      } else {
        messages.append(
          '<div><b>(' +
          message.time +
          ') ' +
          message.name +
          ':</b> ' +
          message.text +
           '</div>'
        );
      };
    };

    var whosTyping = function(typer) {
      $('#typer').text(typer + ' is writing a message')
    }

    var stopTyping = function() {
      $('#typer').text('');
    }

    input.on('keyup', function(event) {
        var name = $('input[name=name]').val();
        var text = $('input[name=message]').val();

        if (event.keyCode != 13) {
          socket.emit('typing', name);
          return;
        }

        var message = {
          type: 'normal',
          time: Date.now(),
          name: name,
          text: text
        };

        addMessage(message);
        socket.emit('message', message);
        socket.emit('stopTyping')
        $('input[name=message]').val('');
    });

    socket.on('message', addMessage);
    socket.on('userUpdate', totalUsers)
    socket.on('typing', whosTyping);
    socket.on('stopTyping', stopTyping);
});
