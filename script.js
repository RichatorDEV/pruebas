window.onload = function() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Crear una esfera interactiva con partículas
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    const sizes = [];
    const particleCount = 5000;

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        vertices.push(x, y, z);

        const color = new THREE.Color(Math.random(), Math.random(), Math.random());
        colors.push(color.r, color.g, color.b);
        sizes.push(Math.random() * 5 + 2);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        vertexColors: true,
        size: 5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 200;

    // Interacción con el ratón
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Información interactiva
    const info = document.createElement('div');
    info.id = 'info';
    info.innerHTML = 'Mueve el ratón para interactuar con la esfera';
    document.body.appendChild(info);

    // Animación
    function animate() {
        requestAnimationFrame(animate);

        // Rotación de partículas según el ratón
        particles.rotation.x += mouseY * 0.01;
        particles.rotation.y += mouseX * 0.01;

        // Efecto de pulsación
        const time = Date.now() * 0.001;
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const dist = Math.sqrt(positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2);
            positions[i] += Math.sin(dist * 0.1 + time) * 0.1;
            positions[i + 1] += Math.cos(dist * 0.1 + time) * 0.1;
            positions[i + 2] += Math.sin(dist * 0.1 + time) * 0.1;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }

    animate();

    // Responsividad
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};