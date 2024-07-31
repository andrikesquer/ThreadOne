document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('file-input');
    const shirtImageContainer = document.querySelector('.product-image');
    let uploadedImage;

    fileInput.addEventListener('change', handleFileSelect);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                if (!uploadedImage) {
                    uploadedImage = document.createElement('img');
                    uploadedImage.id = 'uploaded-image';
                    uploadedImage.style.position = 'absolute';
                    uploadedImage.style.top = '0'; // Alinea la imagen al contenedor
                    uploadedImage.style.left = '0'; // Alinea la imagen al contenedor
                    uploadedImage.style.width = '100px'; // Tamaño inicial más pequeño
                    uploadedImage.style.height = '100px'; // Tamaño inicial más pequeño
                    uploadedImage.style.objectFit = 'contain'; // Ajusta la imagen sin distorsión
                    uploadedImage.style.cursor = 'move'; // Cursor para mover la imagen
                    shirtImageContainer.style.position = 'relative';
                    shirtImageContainer.style.overflow = 'hidden'; // Oculta cualquier desbordamiento
                    shirtImageContainer.appendChild(uploadedImage);

                    // Inicializar Interact.js para la imagen
                    interact('#uploaded-image')
                        .draggable({
                            listeners: {
                                move(event) {
                                    const { target, dx, dy } = event;
                                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + dx;
                                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + dy;

                                    // Restricción de movimiento dentro del contenedor
                                    const containerRect = shirtImageContainer.getBoundingClientRect();
                                    const imgRect = target.getBoundingClientRect();
                                    const newX = Math.min(Math.max(x, 0), containerRect.width - imgRect.width);
                                    const newY = Math.min(Math.max(y, 0), containerRect.height - imgRect.height);

                                    target.style.transform = `translate(${newX}px, ${newY}px)`;
                                    target.setAttribute('data-x', newX);
                                    target.setAttribute('data-y', newY);
                                }
                            },
                            modifiers: [
                                interact.modifiers.restrict({
                                    restriction: 'parent',
                                    endOnly: true
                                })
                            ],
                            inertia: true
                        })
                        .resizable({
                            edges: { left: true, right: true, bottom: true, top: true },
                            listeners: {
                                move(event) {
                                    const { x, y } = event.target.dataset;
                                    const newWidth = Math.max(event.rect.width, 10); // Tamaño mínimo para evitar que desaparezca
                                    const newHeight = Math.max(event.rect.height, 10); // Tamaño mínimo para evitar que desaparezca

                                    const containerRect = shirtImageContainer.getBoundingClientRect();
                                    const imgRect = event.target.getBoundingClientRect();
                                    
                                    // Restricción de redimensionamiento dentro del contenedor
                                    const newLeft = Math.max(0, Math.min(imgRect.left - containerRect.left, containerRect.width - newWidth));
                                    const newTop = Math.max(0, Math.min(imgRect.top - containerRect.top, containerRect.height - newHeight));

                                    Object.assign(event.target.style, {
                                        width: `${newWidth}px`,
                                        height: `${newHeight}px`,
                                        transform: `translate(${newLeft}px, ${newTop}px)`
                                    });

                                    Object.assign(event.target.dataset, { x: newLeft, y: newTop });
                                }
                            },
                            modifiers: [
                                interact.modifiers.restrictEdges({
                                    outer: 'parent',
                                    endOnly: true
                                })
                            ],
                            inertia: true
                        });
                }
                uploadedImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
});

