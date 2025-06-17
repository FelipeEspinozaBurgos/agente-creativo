document.addEventListener('DOMContentLoaded', function() {
            var iconWrapper = document.querySelector('.info-icon-wrapper');
            var tooltip = iconWrapper.querySelector('.tooltip');
            
            if (window.innerWidth <= 600) {
                iconWrapper.addEventListener('click', function(e) {
                    e.preventDefault();
                    tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
                });
                document.addEventListener('click', function(e) {
                    if (!iconWrapper.contains(e.target)) {
                        tooltip.style.display = 'none';
                    }
                });
            }
        });