export async function toggleSidenav() {
    var sidenav = document.getElementById("sidenav");
    if (sidenav.style.display === "block") {
        sidenav.style.display = "none";
    } else {
        sidenav.style.display = "block";
    }
} 