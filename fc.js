<script>
document.addEventListener("DOMContentLoaded", function () {
    autoSortFaceClaims();
});

function autoSortFaceClaims() {
    let claims = Array.from(document.querySelectorAll(".fc-list a"));

    // Extract face claim name and sort alphabetically
    claims.sort((a, b) => {
        let nameA = a.querySelector(".fc-type").textContent.trim().toLowerCase();
        let nameB = b.querySelector(".fc-type").textContent.trim().toLowerCase();
        return nameA.localeCompare(nameB);
    });

    // Clear current lists
    let fcListAJ = document.querySelector(".fc-column:nth-child(1) .fc-list");
    let fcListKZ = document.querySelector(".fc-column:nth-child(2) .fc-list");
    
    fcListAJ.innerHTML = "";
    fcListKZ.innerHTML = "";

    // Distribute face claims into respective columns
    claims.forEach(claim => {
        let name = claim.querySelector(".fc-type").textContent.trim();
        if (name[0].toUpperCase() >= 'A' && name[0].toUpperCase() <= 'J') {
            fcListAJ.appendChild(claim);
        } else {
            fcListKZ.appendChild(claim);
        }
    });
}

// Search function (unchanged)
function filterFaceClaims() {
    let input = document.getElementById("fc-search").value.toLowerCase();
    let claims = document.querySelectorAll(".fc-list a");

    claims.forEach(claim => {
        let text = claim.textContent.toLowerCase();
        claim.style.display = text.includes(input) ? "" : "none";
    });
}
</script>
