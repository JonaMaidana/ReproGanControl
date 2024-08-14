window.addEventListener('load', () => {
  const navLinks = document.querySelectorAll('.nav-custom .nav-link');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;

    if (currentPath === linkPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  //Añadir funcionalidad para marcar el enlace activo en clic
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggle-btn');
  
  toggleBtn.addEventListener('click', function() {
    if (sidebar.classList.contains('closed')) {
      sidebar.classList.remove('closed');
      toggleBtn.querySelector('.toggle-btn-icon').src = 'img/abrir.png'; // Imagen de abrir
    } else {
      sidebar.classList.add('closed');
      toggleBtn.querySelector('.toggle-btn-icon').src = 'img/cerrar.png'; // Imagen de cerrar
    }
  });
});

