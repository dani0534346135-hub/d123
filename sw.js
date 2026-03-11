// sw.js - שירות הרקע של RedAlert OS
self.addEventListener('push', function(event) {
    let data = { title: 'אזעקה!', body: 'היכנס למרחב המוגן מיד!', icon: '/icon.png' };
    
    if (event.data) {
        data = event.data.json();
    }

    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/559/559332.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/559/559332.png',
        vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        },
        actions: [
            {action: 'explore', title: 'פתח אפליקציה'}
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// לחיצה על ההתראה תפתח את האפליקציה
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
