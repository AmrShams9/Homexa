document.addEventListener("DOMContentLoaded", () => {
    const addUserForm = document.getElementById("addUserForm");
    const usersTable = document.getElementById("usersTable");

    // جلب المستخدمين عند تحميل الصفحة
    fetchUsers();

    addUserForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const user = {
            fullName: document.getElementById("fullName").value,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            supplier: document.getElementById("supplierName").value,
            branch: document.getElementById("branch").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value
        };

        try {
            const response = await fetch("/addUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            });

            const result = await response.json();
            alert(result.message);

            if (result.success) {
                addUserForm.reset();
                fetchUsers(); // تحديث الجدول تلقائيًا بعد الإضافة
            }
        } catch (error) {
            console.error("Error adding user:", error);
        }
    });
//     function addUserToTable(user) {
//         const usersTable = document.getElementById("usersTable");
//         const row = `<tr>
//             <td>${user.fullName}</td>
//             <td>${user.username}</td>
//             <td>${user.supplier}</td>
//             <td>${user.branch}</td>
//             <td>${user.phone}</td>
//             <td>${user.email}</td>
//             <td><a href="/editUser" class="edit-btn">✏️ تعديل</a></td>
//         </tr>`;
//         usersTable.innerHTML += row;
//     }
//     // استدعاء fetchOrders عند تحميل الصفحة
// window.addEventListener('DOMContentLoaded', fetchOrders);


    function fetchUsers() {
        fetch("/getUsers")
            .then(response => response.json())
            .then(data => {
                usersTable.innerHTML = `<tr>
                    <th>الاسم</th>
                    <th>اسم المستخدم</th>
                    <th>المورد</th>
                    <th>الفرع</th>
                    <th>رقم الجوال</th>
                    <th>البريد الإلكتروني</th>
                    <th>تعديل</th>
                     <th>الإجراءات</th> <!-- ✅ بدل تعديل وفاضي، خليها خانة واحدة -->
                </tr>`;
    
                data.users.forEach(user => {
                    const row = `<tr>
                        <td>${user.fullName}</td>
                        <td>${user.username}</td>
                        <td>${user.supplier}</td>
                        <td>${user.branch}</td>
                        <td>${user.phone}</td>
                        <td>${user.email}</td>
                        <td><a href="/editUser/${user.id}" class="edit-btn">✏️ تعديل</a>
                        </td>
                        <td><a href="/orders-by-supplier?supplier=${encodeURIComponent(user.supplier)}" class="edit-btn">📦 عرض الطلبات</a></td>
                    </tr>`;
                    usersTable.innerHTML += row;
                });
            })
            .catch(error => console.error("Error fetching users:", error));
    }
});

async function searchOrderByPhone() {
    const phone = document.getElementById('customerPhone').value;
    if (!phone) return alert("يرجى إدخال رقم الهاتف أولاً");

    try {
        const response = await fetch(`/search-order/${phone}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        // عرض البيانات في النموذج
        document.getElementById("customerName").value = data.customerName;
        document.getElementById("serviceTime").value = data.serviceTime;
        document.getElementById("paymentMethod").value = data.paymentMethod;

        if (data.customerLocation) {
            document.getElementById("customerLocation").value = data.customerLocation;
        }

    } catch (err) {
        console.error(err);
        alert("تعذر العثور على بيانات لهذا الرقم.");
    }
}

// Optional: Add event listener to handle Enter key in phone input
// document.getElementById('customerPhone').addEventListener('keypress', function(event) {
//     if (event.key === 'Enter') {
//         event.preventDefault(); // Prevent form submission
//         searchOrderByPhone();
//     }
    

//});


// Existing form submission code
// document.getElementById("orderForm").addEventListener("submit", async function(event) {
//     event.preventDefault(); // منع إعادة تحميل الصفحة

//     const orderData = {
//         customerName: document.getElementById("customerName").value,
//         customerPhone: document.getElementById("customerPhone").value,
//         customerLocation: document.getElementById("customerLocation").value,
//         latitude: document.getElementById("latitudeInput").value,
//         longitude: document.getElementById("longitudeInput").value,
//         mainService: document.getElementById("mainService").value,
//         subService: document.getElementById("subService").value,
//         quantity: document.getElementById("quantity").value,
//         serviceTime: document.getElementById("serviceTime").value,
//         paymentMethod: document.getElementById("paymentMethod").value,
//     };

//     try {
//         const response = await fetch("/addtask", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(orderData),
//         });

//         const result = await response.json();
//         if (response.ok) {
//             alert("تم إرسال الطلب بنجاح!");
//             document.getElementById("orderForm").reset();
//             fetchOrders(); // تحديث الطلبات النشطة
//         } else {
//             alert("حدث خطأ: " + result.error);
//         }
//     } catch (error) {
//         console.error("Error submitting order:", error);
//         alert("حدث خطأ أثناء إرسال الطلب.");
//     }
// });

// // جلب الطلبات النشطة وعرضها
// async function fetchOrders() {
//     try {
//         const response = await fetch("/gettasks");
//         const orders = await response.json();

//         const ordersList = document.getElementById("ordersList");
//         if (!ordersList) {
//             console.error("العنصر ordersList غير موجود في الصفحة!");
//             return;
//         }

//         ordersList.innerHTML = ""; // مسح القائمة القديمة

//         orders.forEach(order => {
//             const orderItem = `<div class="order">
//                 <p><strong>اسم العميل:</strong> ${order.customerName}</p>
//                 <p><strong>الموقع:</strong> ${order.customerLocation}</p>
//                 <p><strong>الخدمة:</strong> ${order.mainService} - ${order.subService}</p>
//                 <p><strong>الكمية:</strong> ${order.quantity}</p>
//                 <p><strong>وقت الخدمة:</strong> ${order.serviceTime}</p>
//                 <p><strong>طريقة الدفع:</strong> ${order.paymentMethod}</p>
//                 <hr>
//             </div>`;
//             ordersList.innerHTML += orderItem;
//         });
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//     }
// }

// Edit order function
function editOrder(id) {
    window.location.href = `/edit_task/${id}`;
}

// Delete order function
async function deleteOrder(id) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الطلب؟')) {
        try {
            const response = await fetch(`/deleteorder/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('تم حذف الطلب بنجاح.');
                fetchOrders(); // Refresh the order list
            } else {
                alert('حدث خطأ أثناء حذف الطلب: ' + result.message);
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('حدث خطأ أثناء حذف الطلب.');
        }
    }
}


   let map, marker, geocoder, searchBox;

function initMap() {
const initialPosition = { lat: 24.7136, lng: 46.6753 };

map = new google.maps.Map(document.getElementById('map'), {
    center: initialPosition,
    zoom: 10
});

geocoder = new google.maps.Geocoder();

const input = document.getElementById('map-search');
searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

map.addListener('click', event => placeMarker(event.latLng));

searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();
    if (places.length === 0 || !places[0].geometry) return;

    map.panTo(places[0].geometry.location);
    placeMarker(places[0].geometry.location);
});
}

function placeMarker(location) {
if (marker) marker.setMap(null);

marker = new google.maps.Marker({
    position: location,
    map: map,
    draggable: true
});

updateLocationInputs(location);

marker.addListener('dragend', () => updateLocationInputs(marker.getPosition()));
}

function updateLocationInputs(location) {
const lat = location.lat();
const lng = location.lng();

document.getElementById('customerLat').value = lat;
document.getElementById('customerLng').value = lng;

geocoder.geocode({ location }, (results, status) => {
    document.getElementById('customerLocation').value =
        (status === 'OK' && results[0]) ? results[0].formatted_address : `Lat: ${lat}, Lng: ${lng}`;
});
}

window.onload = initMap;



function toggleVisibility(sectionId) {
    const section = document.getElementById(sectionId);
    section.style.display = section.style.display === "none" ? "block" : "none";
}

document.getElementById("orderForm").addEventListener("change", function() {
    let total = 0;
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(service => {
        total += parseFloat(service.dataset.price);
    });
    document.getElementById('totalPrice').innerText = total;
});

document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const selectedServices = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                                  .map(service => service.dataset.id);
    fetch("/addtask", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ services: selectedServices })
    })
    .then(response => response.json())
    .then(result => {
        if(result.success) {
            alert("تم إرسال الطلب بنجاح!");
            window.location.reload();
        } else {
            alert("حدث خطأ: " + result.message);
        }
    })
    .catch(error => console.error('Error:', error));
});



// For logout functionality
function logout() {
    // Implementation of logout function
    window.location.href = "/logout";
}

// // Function that might be missing from the original code
// function searchOrderByPhone() {
//     const phoneNumber = document.getElementById("customerPhone").value;
//     // Implementation of phone search functionality
//     console.log("Searching for phone number:", phoneNumber);
//     // Add your implementation here
// }



