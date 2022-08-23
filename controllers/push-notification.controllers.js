const {ONE_SIGNAL_CONFIG} = require('../config/app.config')
const pushNotificationService = require('../services/push-notification.services')

exports.sendNotification = (req, res, next) => {
    var message = {
        app_id:ONE_SIGNAL_CONFIG.APP_ID,
        content: {'en' : 'Test Push Notification'  },
        included_segment:['All'],
        content_available:true,
        small_icon:"ic_notification_icon",
        data:{
            PushTitle:'Custom Notification',
        },
    };

    pushNotificationService.sendNotification(message, (error,result)=>{
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message:'Success',
            data:result,
        })
    })
}

exports.sendNotificationToDevice = (req, res, next) => {
    var message = {
        app_id:ONE_SIGNAL_CONFIG.APP_ID,
        content: {'en' : 'Test Push Notification'  },
        included_segment:['included_player_ids'],
        included_player_ids: req.body.devices ,
        content_available:true,
        small_icon:"ic_notification_icon",
        data:{
            PushTitle:'Custom Notification',
        },
    };

    pushNotificationService.sendNotification(message, (error,result)=>{
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message:'Success',
            data:result,
        })
    })
}