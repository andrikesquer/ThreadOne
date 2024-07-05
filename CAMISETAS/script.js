function toggleColors(element) {
    const colorOptions = element.querySelector('.color-options');
    colorOptions.style.display = colorOptions.style.display === 'none' || colorOptions.style.display === '' ? 'block' : 'none';
}
