// Minimal JS: Could add animations or dynamic content here.
// For example, a simple hover effect on the image.
document.getElementById('profilePic').addEventListener('mouseover', () => {
    document.getElementById('profilePic').style.transform = 'scale(1.1)';
});
document.getElementById('profilePic').addEventListener('mouseout', () => {
    document.getElementById('profilePic').style.transform = 'scale(1)';
});