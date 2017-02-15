const request = require('request')
    , xss = require('xss')
    , bluebird = require('bluebird')
    , User = require('../models/user-mongo')
    , Online = require('../models/online-mongo')
    , History = require('../models/history-mongo')
    , Private = require('../models/private-mongo')
    , RichText = require('../models/richtext-mongo')
    , Room = require('../models/room-mongo')
    , config = require('../config/cr-config');
module.exports = {
    saveMessage: function *(message,socket,cb) {
        let { _id, room, content, type } = message,
            timestamp = Date.now();
        content = message.content.slice(0,500);
        let history = { room, type, content, timestamp };
        let user = yield User.findOne({ _id });
        if(user){
            history.owner = user._id;
            let owner = {avatar: user.avatar, _id: user._id,nickname: user.nickname},
                newHistory = new History(history),
                tRoom = yield Room.findOne({_id: message.room});
            if(tRoom){
                tRoom.histories.push(newHistory._id);
                tRoom.lastMessage = timestamp;
                yield newHistory.save();
                yield tRoom.save();
                let ret = { owner, room , content, type, timestamp, _id: newHistory._id };
                socket.broadcast.to(message.room).emit('newMessage',ret);
                // cb({isOk: true}); //这里可以选择不返回消息内容
                cb(ret);
            } else{
                cb({ isError: true, errMsg:'ERROR1005' });
            }
        } else{
            cb({ isError: true, errMsg:'ERROR1003'});
        }
    },
}