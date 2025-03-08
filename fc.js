<script>
document.addEventListener("DOMContentLoaded", function () {
    autoSortFaceClaims();
});

function autoSortFaceClaims() {
    let claims = Array.from(document.querySelectorAll(".fc-entry"));

    // Sort alphabetically by face claim name
    claims.sort((a, b) => {
        let nameA = a.querySelector("a").textContent.trim().toLowerCase();
        let nameB = b.querySelector("a").textContent.trim().toLowerCase();
        return nameA.localeCompare(nameB);
    });

    // Get sorting containers
    let fcListAJ = document.querySelector(".fc-column:nth-child(1) .fc-list");
    let fcListKZ = document.querySelector(".fc-column:nth-child(2) .fc-list");

    // Clear existing entries
    fcListAJ.innerHTML = "";
    fcListKZ.innerHTML = "";

    // Distribute sorted face claims into respective columns
    claims.forEach(claim => {
        let name = claim.querySelector("a").textContent.trim();
        if (name[0].toUpperCase() >= 'A' && name[0].toUpperCase() <= 'J') {
            fcListAJ.appendChild(claim);
        } else {
            fcListKZ.appendChild(claim);
        }
    });
}

// Enhanced Search: Checks both Face Claim Name and Series
function filterFaceClaims() {
    let input = document.getElementById("fc-search").value.toLowerCase();
    let claims = document.querySelectorAll(".fc-entry");

    claims.forEach(claim => {
        let fcName = claim.querySelector("a").textContent.toLowerCase();
        let fcSeries = claim.querySelector(".fc-series").textContent.toLowerCase();
        
        // Show if either the FC Name or Series matches the search
        claim.style.display = (fcName.includes(input) || fcSeries.includes(input)) ? "" : "none";
    });
}
</script>
