let map;
let marker;
let selectedLat, selectedLng;

// Initialize the map modal
function initMap() {
    // Default location (can be set to a city center in your region)
    const defaultLocation = { lat: 24.7136, lng: 46.6753 }; // Riyadh, Saudi Arabia

    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
    });

    // Create a marker that users can drag to select location
    marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP
    });

    // Update coordinates when marker is dragged
    google.maps.event.addListener(marker, 'dragend', function() {
        updateLocationFromMarker();
    });

    // Add click listener to map
    google.maps.event.addListener(map, 'click', function(event) {
        marker.setPosition(event.latLng);
        updateLocationFromMarker();
    });
}

function updateLocationFromMarker() {
    const position = marker.getPosition();
    selectedLat = position.lat();
    selectedLng = position.lng();
    document.getElementById("locationInfo").innerHTML = 
        `الموقع المحدد: ${selectedLat.toFixed(6)}, ${selectedLng.toFixed(6)}`;
}

function openMapsModal() {
    document.getElementById("mapsModal").style.display = "block";
    
    // Initialize the map when modal is opened
    // Load Google Maps API if it's not already loaded
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        const script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDcbG4Bb4SRpgeVxp-imrm4X3CyS_e2deE&libraries=places";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    } else {
        // If already loaded, just init the map
        initMap();
    }
}

function closeMapsModal() {
    document.getElementById("mapsModal").style.display = "none";
}

function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Update the map and marker
                map.setCenter(currentLocation);
                marker.setPosition(currentLocation);
                
                // Update selected coordinates
                selectedLat = currentLocation.lat;
                selectedLng = currentLocation.lng;
                
                document.getElementById("locationInfo").innerHTML = 
                    `الموقع المحدد: ${selectedLat.toFixed(6)}, ${selectedLng.toFixed(6)}`;
            },
            function(error) {
                alert("حدث خطأ أثناء محاولة تحديد موقعك: " + getGeolocationErrorMessage(error));
            }
        );
    } else {
        alert("المتصفح لا يدعم تحديد الموقع الجغرافي.");
    }
}

function getGeolocationErrorMessage(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            return "تم رفض إذن الوصول إلى الموقع.";
        case error.POSITION_UNAVAILABLE:
            return "معلومات الموقع غير متاحة.";
        case error.TIMEOUT:
            return "انتهت مهلة طلب الموقع.";
        case error.UNKNOWN_ERROR:
            return "حدث خطأ غير معروف.";
    }
}

function confirmLocation() {
    if (selectedLat && selectedLng) {
        // Save the coordinates to the form fields
        document.getElementById("latitudeInput").value = selectedLat;
        document.getElementById("longitudeInput").value = selectedLng;
        
        // Create a Google Maps link and display it in the input field
        const mapsLink = `https://www.google.com/maps?q=${selectedLat},${selectedLng}`;
        document.getElementById("customerLocation").value = mapsLink;
        // document.getElementById("customerLocation1").value = mapsLink;

        
        // Close the modal
        closeMapsModal();
    } else {
        alert("الرجاء تحديد موقع على الخريطة أولاً.");
    }
}

// Existing form submission code
document.getElementById("orderForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة

    const orderData = {
        customerName: document.getElementById("customerName").value,
        customerPhone: document.getElementById("customerPhone").value,
        customerLocation: document.getElementById("customerLocation").value,
        latitude: document.getElementById("latitudeInput").value,
        longitude: document.getElementById("longitudeInput").value,
        mainService: document.getElementById("mainService").value,
        subService: document.getElementById("subService").value,
        quantity: document.getElementById("quantity").value,
        serviceTime: document.getElementById("serviceTime").value,
        paymentMethod: document.getElementById("paymentMethod").value,
    };

    try {
        const response = await fetch("/addtask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
        });

        const result = await response.json();
        if (response.ok) {
            alert("تم إرسال الطلب بنجاح!");
            document.getElementById("orderForm").reset();
            fetchOrders(); // تحديث الطلبات النشطة
        } else {
            alert("حدث خطأ: " + result.error);
        }
    } catch (error) {
        console.error("Error submitting order:", error);
        alert("حدث خطأ أثناء إرسال الطلب.");
    }
});

// جلب الطلبات النشطة وعرضها
async function fetchOrders() {
    try {
        const response = await fetch("/gettasks");
        const orders = await response.json();

        const ordersList = document.getElementById("ordersList");
        if (!ordersList) {
            console.error("العنصر ordersList غير موجود في الصفحة!");
            return;
        }

        ordersList.innerHTML = ""; // مسح القائمة القديمة

        orders.forEach(order => {
            const orderItem = `<div class="order">
                <p><strong>اسم العميل:</strong> ${order.customerName}</p>
                <p><strong>الموقع:</strong> ${order.customerLocation}</p>
                <p><strong>الخدمة:</strong> ${order.mainService} - ${order.subService}</p>
                <p><strong>الكمية:</strong> ${order.quantity}</p>
                <p><strong>وقت الخدمة:</strong> ${order.serviceTime}</p>
                <p><strong>طريقة الدفع:</strong> ${order.paymentMethod}</p>
                <hr>
            </div>`;
            ordersList.innerHTML += orderItem;
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
}

// For logout functionality
function logout() {
    // Implementation of logout function
    window.location.href = "/logout";
}

// Function that might be missing from the original code
function searchOrderByPhone() {
    const phoneNumber = document.getElementById("customerPhone").value;
    // Implementation of phone search functionality
    console.log("Searching for phone number:", phoneNumber);
    // Add your implementation here
}