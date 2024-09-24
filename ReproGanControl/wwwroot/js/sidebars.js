document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggle-btn');
  
  toggleBtn.addEventListener('click', function() {
    if (sidebar.classList.contains('closed')) {
      sidebar.classList.remove('closed');
      toggleBtn.querySelector('.toggle-btn-icon').src = '/img/abrir.png'; // Imagen de abrir
    } else {
      sidebar.classList.add('closed');
      toggleBtn.querySelector('.toggle-btn-icon').src = '/img/cerrar.png'; // Imagen de cerrar
    }
  });
});

