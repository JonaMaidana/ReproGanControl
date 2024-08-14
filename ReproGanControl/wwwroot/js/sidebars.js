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

document.addEventListener("DOMContentLoaded", function() {
  const contentWrapper = document.getElementById('page-content-wrapper');
  
  function fadeOutContent() {
      contentWrapper.classList.add('fade-out');
  }

  function fadeInContent() {
      contentWrapper.classList.remove('fade-out');
  }

  // Llama a fadeOutContent antes de hacer la transición
  // y fadeInContent después de que el contenido esté listo
  document.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function(event) {
          event.preventDefault(); // Evita el comportamiento por defecto del enlace
          fadeOutContent();

          // Espera la duración de la transición antes de cambiar el contenido
          setTimeout(() => {
              window.location.href = this.href; // Navega a la nueva URL
          }, 500); // Tiempo de espera igual al tiempo de la transición
      });
  });
});
