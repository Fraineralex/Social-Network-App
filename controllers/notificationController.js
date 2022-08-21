const friend = require("../models/Friends");
const notification = require("../models/Notifications");
const user = require("../models/Users");
const { Op } = require("sequelize");
const webPush = require('../util/webPush');
const fs = require('fs');
const path = require('path');

//get all notifications
module.exports.getAllNotifications = async (req, res, next) => {

    let userId = req.user.id;

    user.findOne({ where: { id: userId } }).then((f) => {
      const currentlyUser = f.dataValues;

      friend.findAll({
        where: {
          [Op.or]: [
            { [Op.and]: [{ receptorID: userId }] },
          ]
        }
      }).then((fs) => {
        const friendS= fs.map(f => f.dataValues);
        const usersIdSender = friendS.map(f => f.senderID);

        user.findAll({where: {[Op.or]:[{id: usersIdSender}]}}).then((us)=>{
          const userS = us.map(u => u.dataValues);
          
          res.render("./client/Notification", {
            pageTitle: "Friend",
            user: currentlyUser,
            friendS,
            userS,
          });
          
        }).catch((err) => console.log(err));
      }).catch((err) => console.log(err));
  }).catch((err) => console.log(err));
}



//friendShip solicitations
module.exports.solicitudeFriend = (req, res, next) => {

  let userId = req.params.userId;
  let friendID = req.params.friendID;
  let friendRequestId = req.params.friendRequestId;
  let typeNotificationV = 'Friend Request';
  let isReadV = false;

  friend.findOne({ where: { id: friendRequestId } }).then((f) => {

    res.status(200).redirect(`/searchNewFriendHome/${userId}}`);
    notification.create({typeNotification: typeNotificationV, isRead: isReadV, friendId: friendRequestId}).then(() => {
      user.findOne({where: {id: friendID}}).then(async (f)=>{

        let friendInfo = f.dataValues;

        let endpoint = await JSON.parse(fs.readFileSync(path.join(__dirname, "../endpoint.json"), 'utf8'));
      
        let container = endpoint.filter(sub => sub.userId === `${friendID}`);
        console.log(container);
        pushSubscription = container[0].subscriptions;
      
        const userNotification = JSON.stringify({
          title: "Friend Request",
          body: `${friendInfo.user} has sent you a friend request`,
          icon: `${friendInfo.imageProfile}`,
        });
      
        //send the notification to the user
        await webPush.sendNotification(pushSubscription, userNotification);

      }).catch((err) => console.log(err));    
    }).catch(err => console.log(err));
  }).catch((err) => console.log(err));

}


//move this for loggin route and controller
module.exports.getNotifications =  async (req, res, next) => {
 
  let endpoint = JSON.parse(fs.readFileSync(path.join(__dirname, "../endpoint.json"), 'utf8'));
  console.log('\n\n\n\n pase por aqui', '\n\n\n\n', endpoint);
  
  if (endpoint.find(x => x.userId === req.body.userId)) {
    let endpointSave = endpoint.filter(x => x.userId != req.body.userId);
    let concatenated = endpointSave.concat(req.body);
    fs.writeFileSync(path.join(__dirname, "../endpoint.json"), JSON.stringify(concatenated, null, 2));
    console.log("subscription updated");

  } else {//add the subscription to the json file
    endpoint.push(req.body);
    fs.writeFileSync(path.join(__dirname, "../endpoint.json"), JSON.stringify(endpoint, null, 2));
    console.log("subscription added");
  }

  res.status(200).json();
}
