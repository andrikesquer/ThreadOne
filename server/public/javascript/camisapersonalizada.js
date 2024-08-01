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
                    uploadedImage.style.top = '0';
                    uploadedImage.style.left = '0';
                    uploadedImage.style.width = '100px';
                    uploadedImage.style.height = '100px';
                    uploadedImage.style.objectFit = 'fill'; // Ajuste sin distorsión
                    uploadedImage.style.cursor = 'move';
                    shirtImageContainer.style.position = 'relative';
                    shirtImageContainer.style.overflow = 'hidden';
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
                                    endOnly: false
                                })
                            ],
                            inertia: true
                        })
                        .resizable({
                            edges: { left: true, right: true, bottom: true, top: true },
                            listeners: {
                                move(event) {
                                    const { x, y } = event.target.dataset;
                                    const { width, height } = event.rect;

                                    const containerRect = shirtImageContainer.getBoundingClientRect();
                                    const imgRect = event.target.getBoundingClientRect();

                                    const newWidth = Math.max(width, 10); // Tamaño mínimo para evitar desaparición
                                    const newHeight = Math.max(height, 10); // Tamaño mínimo para evitar desaparición

                                    // Ajustar la posición y tamaño
                                    const newLeft = Math.max(0, Math.min(imgRect.left - containerRect.left, containerRect.width - newWidth));
                                    const newTop = Math.max(0, Math.min(imgRect.top - containerRect.top, containerRect.height - newHeight));

                                    // Aplicar el nuevo tamaño y la transformación correcta
                                    event.target.style.width = `${newWidth}px`;
                                    event.target.style.height = `${newHeight}px`;

                                    // Asegurarse de que la imagen se mantenga dentro del contenedor
                                    const finalLeft = Math.max(0, Math.min(newLeft, containerRect.width - newWidth));
                                    const finalTop = Math.max(0, Math.min(newTop, containerRect.height - newHeight));

                                    event.target.style.transform = `translate(${finalLeft}px, ${finalTop}px)`;
                                    Object.assign(event.target.dataset, { x: finalLeft, y: finalTop });
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
