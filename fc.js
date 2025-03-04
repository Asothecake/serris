<script>
function filterFaceClaims() {
    let input = document.getElementById("fc-search").value.toLowerCase();
    let claims = document.querySelectorAll(".fc-list a");

    claims.forEach(claim => {
        let text = claim.textContent.toLowerCase();
        claim.style.display = text.includes(input) ? "" : "none";
    });
}
</script>
