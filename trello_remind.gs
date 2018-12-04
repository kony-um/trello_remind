function trelloRemind() {
  var api_key = 'your api key';
  var api_secret = 'your api secret';
  var user_name = 'your user name';
  var board_id = 'getBoardListで取得したものを使う';

  var json = getCards(api_key, api_secret, board_id);
  var targets = json.filter(isTarget);
  if (targets.length == 0) {
    return;
  }

  var message = getMessage(targets);
  notifyChatwork(message);
  Logger.log(message);
}

function getBoardList(){
  var url = 'https://api.trello.com/1/members/' + user_name + '/boards?key=' + api_key + '&token=' + api_secret + '&fields=name';
  var options = {
    'method' : 'get',
    'muteHttpExceptions' : true
  }
  Logger.log(UrlFetchApp.fetch(url, options));
}

function getCards(api_key, api_secret, board_id) {
  var url = 'https://api.trello.com/1/boards/' + board_id + '/cards?key=' + api_key + '&token=' + api_secret;
  var options = {
    'method' : 'get',
    'muteHttpExceptions' : true
  }
  var res = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(res);
  return json
}

function isTarget(data) {
  var due = new Date(data.due);
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return data.dueComplete != true && data.due != null && due < tomorrow;
}

function getMessage(targets) {
  var message = '[info][title]Trelloの未完タスクのリマインド[/title]';
  targets.map(function(data) {
    message += '件名:' +data.name + '\n';
    message += '期限:' + data.due + '\n';
    message += 'URL:' + data.shortUrl + '\n\n';
  });
  message += '[/info]';
  return message;
}

function notifyChatwork(message) {
  var client = ChatWorkClient.factory({token: 'your api token'});
  client.sendMessage({room_id: 'your room id', body: message});
}