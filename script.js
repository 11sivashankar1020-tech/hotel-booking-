let users = JSON.parse(localStorage.getItem("users")) || [];
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
let savedUser = "", savedPass = "";
let defaultRooms = [
{name:"Deluxe Room", price:2000, image:"image/room1.jpg", description:"A cozy deluxe room."},
{name:"Luxury Room", price:3500, image:"image/room2.jpg", description:"Spacious luxury room."},
{name:"Super Luxary Room", price:6000, image:"image/room5.jpg", description:"Top tier room."}
];

let rooms = JSON.parse(localStorage.getItem("rooms")) || defaultRooms; 

function showLogin(){togglePages('loginPage')} function showSignup()
{togglePages('signupPage')} function showAdminLogin(){togglePages
('adminLoginPage')} function showHome(){togglePages('homePage')} function
showBooking(){togglePages('bookingPage')} function showAdmin(){togglePages
('adminPanel')} 

function togglePages(showId){ 
['loginPage','signupPage','homePage','bookingPage','adminLoginPage','adminPanel'].forEach(id=>{ 
document.getElementById(id).classList.add('d-none'); 
}); 
document.getElementById(showId).classList.remove('d-none'); 
if(showId=='homePage') renderRooms();  
} 
// REGISTER 
function register(){ 

  let user = document.getElementById('username').value; 
  let email = document.getElementById('email').value; 
  let pass = document.getElementById('password').value; 

  if(!user || !email || !pass){
    alert('Fill all fields');
    return;
  }

  // Email Validation
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(!emailPattern.test(email)){
    alert('Enter valid email address');
    return;
  }

  savedUser = user;
  savedPass = pass; 

  users.push({
    username:user,
    email:email,
    password:pass,
    status:'active'
  }); 

  localStorage.setItem("users", JSON.stringify(users)); 

  document.getElementById('registerMsg').innerText='Register Successful'; 

  setTimeout(showLogin,1000); 
}
// LOGIN 
function login(){ 
let user=document.getElementById('loginUser').value; 
let pass=document.getElementById('loginPass').value; 
if(!user||!pass){alert('Fill all fields');return;} 
let u=users.find(u=>u.username===user && u.password===pass && 
u.status==='active'); 
if(u){document.getElementById('loginMsg').innerText='Login Successful'; 
setTimeout(showHome,500);}  
else{document.getElementById('loginMsg').innerText='Invalid Login'} 
} 
// RENDER ROOMS 
function renderRooms(){  
let search = document.getElementById("searchInput")?.value.toLowerCase() || ""; 
let filter = document.getElementById("priceFilter")?.value; 
let html='';  
 
  rooms.forEach((r,i)=>{  
 
    if(search && !r.name.toLowerCase().includes(search)){ 
      return; 
    } 
 
    if(filter && r.price > filter){ 
      return; 
    } 
 
    html+=`<div class="col-md-4 mb-4">  
      <div class="card">
        <img src="${r.image}" class="card-img-top" onerror="console.log('Image Error:', this.src)">    
        <div class="card-body">  
          <h5>${r.name}</h5>  
          <p>₹${r.price} / night</p>  
          <button class="btn btn-success" onclick="openBooking(${i})">Book Now</button>  
        </div>  
      </div>  
    </div>`;  
  });  
 
  document.getElementById('roomList').innerHTML=html;  
} 
 
// OPEN BOOKING 
function openBooking(index){ 
  document.getElementById('roomName').innerText=rooms[index].name; 
  showBooking(); 
} 
 
// CONFIRM BOOKING 
// CONFIRM BOOKING (Auto-Confirmation Logic) 
function confirmBooking(){  
    let name = document.getElementById('custName').value;  
    let age = document.getElementById('age').value;  
    let roomName = document.getElementById('roomName').innerText;  
 
    if(!name || !age){ 
        alert('Please fill all details');  
        return; 
    }  
 
    // Inga 'Pending'-ku pathila 'Confirmed' nu kudukanum 
    bookings.push({ 
        name: name, 
        age: age, 
        roomName: roomName, 
        status: 'Confirmed' // Auto confirmation inga thaan nadakkuthu 
    });  
    localStorage.setItem("bookings", JSON.stringify(bookings)); 
 
    document.getElementById('bookingMsg').innerText = 'Room Booked and Confirmed Automatically! ';  
     
    // User-ku feedback theriyanum nu 1.5 seconds kazhithu home page-ku pogum 
    setTimeout(showHome, 1500);  
} 
 
// ADMIN LOGIN 
 
function adminLogin(){ 
    let user = document.getElementById('adminUser').value; 
    let pass = document.getElementById('adminPass').value; 
 
    // Password-ai inga change pannikkalam 
    if(user === 'admin' && pass === '1212'){  
        showAdmin();  
        showDashboard(); 
    } else { 
        document.getElementById('adminMsg').innerText = 'Invalid Admin'; 
    } 
} 
 
// ADMIN LOGOUT 
function adminLogout(){showAdminLogin()} 
 
// DASHBOARD 
function showDashboard(){ 
  let html=`<h3>Dashboard Summary</h3> 
    <p>Total Users: ${users.length}</p> 
    <p>Total Rooms: ${rooms.length}</p> 
    <p>Total Bookings: ${bookings.length}</p> 
    <p>Pending Bookings: ${bookings.filter(b=>b.status==='Pending').length}</p> 
    <p>Confirmed Bookings: ${bookings.filter(b=>b.status==='Confirmed').length}</p>`; 
  document.getElementById('adminContent').innerHTML=html; 
} 
 
// USERS MANAGEMENT 
function showUsers(){ 
  let html = '<h3 class="mb-3">Users List</h3>'; 

  html += '<ul class="list-group">'; 

  users.forEach((u,i)=>{ 

    html += `
      <li class="list-group-item user-item">

        <div class="user-info">
          ${u.username} (${u.email}) - ${u.status}
        </div>

        <div class="user-actions">
          <button 
            class="btn btn-sm btn-danger"
            onclick="deleteUser(${i})">
            Delete
          </button>

          <button 
            class="btn btn-sm btn-warning"
            onclick="toggleBlockUser(${i})">
            ${u.status === 'active' ? 'Block' : 'Unblock'}
          </button>
        </div>

      </li>
    `;

  }); 

  html += '</ul>'; 

  document.getElementById('adminContent').innerHTML = html;
}
function deleteUser(i){ 
  users.splice(i,1); 
  localStorage.setItem("users", JSON.stringify(users)); 
  showUsers(); 
} 
function toggleBlockUser(i){ 
  users[i].status=users[i].status==='active'?'blocked':'active'; 
  localStorage.setItem("users", JSON.stringify(users)); 
  showUsers(); 
} 
 
// ROOMS MANAGEMENT 
function showRooms(){ 
  let html='<h3>Rooms List</h3>'; 
  html+='<button class="btn btn-success mb-3" onclick="addRoomForm()">Add Room</button>'; 
  rooms.forEach((r,i)=>{ 
    html+=`<div class="card mb-2 p-2"> 
      <h5>${r.name} - ₹${r.price}</h5> 
      <p>${r.description}</p> 
      <img src="${r.image}" style="width:100px;"> 
      <br> 
      <button class="btn btn-primary btn-sm" onclick="editRoom(${i})">Edit</button> 
      <button class="btn btn-danger btn-sm" onclick="deleteRoom(${i})">Delete</button> 
    </div>`; 
  }); 
  document.getElementById('adminContent').innerHTML=html; 
} 
function addRoomForm(){ 
  let html=`<h3>Add New Room</h3> 
    <input class="form-control my-2" id="newRoomName" placeholder="Room Name"> 
    <input class="form-control my-2" id="newRoomPrice" placeholder="Price" 
type="number"> 
    <input class="form-control my-2" id="newRoomImage" placeholder="Image URL"> 
    <input class="form-control my-2" id="newRoomDesc" placeholder="Description"> 
    <button class="btn btn-success mt-2" onclick="addRoom()">Add Room</button>`; 
  document.getElementById('adminContent').innerHTML=html; 
} 

function addRoom(){ 
  let name=document.getElementById('newRoomName').value; 
  let price=document.getElementById('newRoomPrice').value; 
  let image=document.getElementById('newRoomImage').value; 
  let desc=document.getElementById('newRoomDesc').value; 
  if(!name||!price||!image||!desc){alert('Fill all fields'); return;} 

  rooms.push({name,price,image,description:desc});
  localStorage.setItem("rooms", JSON.stringify(rooms));

showRooms(); 
} 

function editRoom(i){ 
  let r=rooms[i]; 
  let html=`<h3>Edit Room</h3> 
    <input class="form-control my-2" id="editRoomName" value="${r.name}"> 
    <input class="form-control my-2" id="editRoomPrice" value="${r.price}" 
type="number"> 
    <input class="form-control my-2" id="editRoomImage" value="${r.image}"> 
    <input class="form-control my-2" id="editRoomDesc" value="${r.description}"> 
    <button class="btn btn-success mt-2" onclick="updateRoom(${i})">Update 
Room</button>`; 
  document.getElementById('adminContent').innerHTML=html; 
} 

function updateRoom(i){
 rooms[i].name=document.getElementById('editRoomName').value;
 rooms[i].price=document.getElementById('editRoomPrice').value;
 rooms[i].image=document.getElementById('editRoomImage').value;
 rooms[i].description=document.getElementById('editRoomDesc').value;

 localStorage.setItem("rooms", JSON.stringify(rooms));

 showRooms();
}

function deleteRoom(i){
 rooms.splice(i,1);

 localStorage.setItem("rooms", JSON.stringify(rooms));

 showRooms();
}    
 
// BOOKINGS MANAGEMENT 
function showBookings(){ 
  let html='<h3>Bookings List</h3>'; 
  bookings.forEach((b,i)=>{ 
    html+=`<div class="card mb-2 p-2"> 
      <p>${b.name}, Age: ${b.age}, Room: ${b.roomName}, Status: ${b.status}</p> 
      <button class="btn btn-danger btn-sm" onclick="cancelBooking(${i})">Cancel 
Booking</button> 
      <button class="btn btn-success btn-sm" 
onclick="confirmBookingAdmin(${i})">Confirm</button> 
    </div>`; 
  }); 
  document.getElementById('adminContent').innerHTML=html; 
} 
function cancelBooking(i){ 
  bookings.splice(i,1); 
  localStorage.setItem("bookings", JSON.stringify(bookings)); 
  showBookings(); 
} 
 
function confirmBookingAdmin(i){bookings[i].status='Confirmed'; showBookings();} 
 
function confirmBookingAdmin(i){ 
  bookings[i].status='Confirmed';  
  showBookings(); 
} 
 
 
// SMART PRICE & ROOM SUGGESTION 
function getSuggestedRoom() { 
    let age = document.getElementById('age').value; 
    let roomName = document.getElementById('roomName').innerText; 
    let suggestionMsg = document.getElementById('bookingMsg'); 
 
    if (!age) { 
        suggestionMsg.innerText = ""; 
        return; 
    } 
 
    let suggestion = ""; 
    let priceOAer = ""; 
 
    // 1. Age-based Room Suggestion 
    if (age < 25) { 
        suggestion = "Deluxe Room (Budget Friendly)"; 
    } else if (age >= 25 && age <= 40) { 
        suggestion = "Luxury Room (Best Comfort)"; 
    } else { 
        suggestion = "Super Luxury Room (Premium)"; 
    } 
 
    // 2. Smart Price Logic (Dynamic OAers) 
    if (age < 22) { 
        priceOAer = "Student Discount: 10% OFF applied!"; 
    } else if (age > 60) { 
        priceOAer = "Senior Citizen OAer: Free Breakfast included!"; 
    } else { 
        priceOAer = "Best value guaranteed for your stay!"; 
    } 
 
    // Displaying the result 
    suggestionMsg.innerHTML = ` 
        <div style="border: 1px solid #007bA; padding: 10px; border-radius: 5px; 
background-color: #e7f3A;"> 
            <p style="color: #0056b3; margin-bottom: 5px;"><strong> 
Suggestion:</strong> ${suggestion}</p> 
            <p style="color: #28a745; font-weight: bold; margin-bottom: 0;"><strong> 
OAer:</strong> ${priceOAer}</p> 
        </div> 
    `; 
} 
 
 
//  ADD HERE 
window.onload = function(){ 
  showHome(); 
}