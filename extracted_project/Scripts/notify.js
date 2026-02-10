var $notify = function(title, body, image, click, fallBack) {
    if (!navigator.userAgent.match(/Mobi/) && window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function(status) {
            var n = new Notification(title,
                {
                    image: image,
                    body: body,
                    icon: '/images/logoK_SQUARED.png'
                });
            n.onclick = function(event) {
                event.preventDefault();
                try {
                    click();
                    n.close();
                } catch (e) {
                }
            }
        });
    } else {
        try {
            fallBack();
        } catch (e) {
        }
    }
};