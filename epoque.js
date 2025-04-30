<script>
document.querySelectorAll('.epoque-container').forEach(container => {
  const fill = container.querySelector('.epoque-hp-fill');
  const current = parseInt(container.dataset.epoqueHp);
  const max = parseInt(container.dataset.epoqueMax);
  if (!isNaN(current) && !isNaN(max) && max > 0) {
    const percent = Math.min((current / max) * 100, 100);
    fill.style.width = percent + '%';
  }
});
</script>
