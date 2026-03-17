// ===== 3D BACKGROUND - RANDOM STYLE SELECTOR =====
function init3D() {
    const canvas = document.getElementById('canvas-3d');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // اختيار نمط عشوائي (0-4)
    const randomStyle = Math.floor(Math.random() * 5);
    console.log(`🎨 تم تفعيل النمط ثلاثي الأبعاد رقم ${randomStyle + 1}`);
    
    // Lighting أساسي لجميع الأنماط
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // تنفيذ النمط المختار
    switch(randomStyle) {
        case 0:
            createGalaxyStyle(scene, camera, renderer);
            break;
        case 1:
            createDigitalCodeStyle(scene, camera, renderer);
            break;
        case 2:
            createSparklingLightsStyle(scene, camera, renderer);
            break;
        case 3:
            createNablaPulseStyle(scene, camera, renderer);
            break;
        case 4:
            createGoldenCodeStyle(scene, camera, renderer);
            break;
    }
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ===========================================
// النمط 1: المجرة الذهبية (Galaxy Style)
// ===========================================
function createGalaxyStyle(scene, camera, renderer) {
    const pointLight1 = new THREE.PointLight(0xD4AF37, 1, 20);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xB8860B, 0.5, 20);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);
    
    const mainGroup = new THREE.Group();
    
    // Nabla Symbol
    const triangleGroup = new THREE.Group();
    const triangleGeometry = new THREE.ConeGeometry(1.2, 2, 3);
    const triangleMaterial = new THREE.MeshPhongMaterial({
        color: 0xD4AF37,
        emissive: 0x332200,
        shininess: 60,
        transparent: true,
        opacity: 0.7
    });
    const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
    triangle.rotation.x = Math.PI;
    triangle.rotation.y = 0.2;
    triangleGroup.add(triangle);
    
    const glowGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xD4AF37,
        transparent: true,
        opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    triangleGroup.add(glow);
    mainGroup.add(triangleGroup);
    
    // Particles
    const particleCount = 1500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const radius = 4 + Math.random() * 6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = radius * Math.cos(phi);
        
        const goldVar = 0.8 + Math.random() * 0.4;
        particleColors[i * 3] = goldVar;
        particleColors[i * 3 + 1] = goldVar * 0.7;
        particleColors[i * 3 + 2] = goldVar * 0.2;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particles);
    
    // Rings
    const ringGeometry = new THREE.TorusGeometry(2.5, 0.03, 16, 100);
    const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0xD4AF37,
        emissive: 0x221100,
        transparent: true,
        opacity: 0.3
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.z = 0.3;
    mainGroup.add(ring);
    
    const ring2Geometry = new THREE.TorusGeometry(3, 0.02, 16, 100);
    const ring2Material = new THREE.MeshPhongMaterial({
        color: 0xB8860B,
        emissive: 0x221100,
        transparent: true,
        opacity: 0.2
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = 0.5;
    mainGroup.add(ring2);
    
    scene.add(mainGroup);
    camera.position.z = 10;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        mainGroup.rotation.y += 0.001;
        mainGroup.rotation.x += 0.0005;
        triangleGroup.rotation.y += 0.01;
        triangleGroup.rotation.z += 0.005;
        ring.rotation.z += 0.002;
        ring2.rotation.y += 0.003;
        renderer.render(scene, camera);
    }
    animate();
}

// ===========================================
// النمط 2: الشفرة الرقمية (Digital Code)
// ===========================================
function createDigitalCodeStyle(scene, camera, renderer) {
    const directionalLight = new THREE.DirectionalLight(0xD4AF37, 1);
    directionalLight.position.set(2, 3, 4);
    scene.add(directionalLight);
    
    const mainGroup = new THREE.Group();
    
    // Floating cubes
    const cubeCount = 300;
    const cubes = [];
    
    for (let i = 0; i < cubeCount; i++) {
        const size = 0.1 + Math.random() * 0.2;
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshPhongMaterial({
            color: 0xD4AF37,
            emissive: 0x332200,
            transparent: true,
            opacity: 0.3 + Math.random() * 0.4,
            wireframe: Math.random() > 0.7
        });
        
        const cube = new THREE.Mesh(geometry, material);
        const radius = 3 + Math.random() * 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        cube.position.x = radius * Math.sin(phi) * Math.cos(theta);
        cube.position.y = radius * Math.sin(phi) * Math.sin(theta);
        cube.position.z = radius * Math.cos(phi);
        
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;
        
        cubes.push({
            mesh: cube,
            speed: 0.001 + Math.random() * 0.003,
            axis: Math.floor(Math.random() * 3)
        });
        
        mainGroup.add(cube);
    }
    
    // Center icosahedron
    const centerGroup = new THREE.Group();
    const icoGeometry = new THREE.IcosahedronGeometry(1.2, 0);
    const icoMaterial = new THREE.MeshPhongMaterial({
        color: 0xD4AF37,
        emissive: 0x221100,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    const ico = new THREE.Mesh(icoGeometry, icoMaterial);
    centerGroup.add(ico);
    
    const sphereGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const sphereMat = new THREE.MeshPhongMaterial({
        color: 0xB8860B,
        emissive: 0x221100,
        transparent: true,
        opacity: 0.3
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    centerGroup.add(sphere);
    
    mainGroup.add(centerGroup);
    
    // Orbiting dots
    const dotCount = 8;
    for (let i = 0; i < dotCount; i++) {
        const dotGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const dotMat = new THREE.MeshPhongMaterial({
            color: 0xD4AF37,
            emissive: 0x332200
        });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        const angle = (i / dotCount) * Math.PI * 2;
        dot.position.set(Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0);
        mainGroup.add(dot);
    }
    
    scene.add(mainGroup);
    camera.position.z = 10;
    
    function animate() {
        requestAnimationFrame(animate);
        mainGroup.rotation.y += 0.001;
        mainGroup.rotation.x += 0.0005;
        centerGroup.rotation.y += 0.01;
        centerGroup.rotation.x += 0.005;
        
        cubes.forEach(cube => {
            if (cube.axis === 0) cube.mesh.rotation.x += cube.speed;
            else if (cube.axis === 1) cube.mesh.rotation.y += cube.speed;
            else cube.mesh.rotation.z += cube.speed;
        });
        
        renderer.render(scene, camera);
    }
    animate();
}

// ===========================================
// النمط 3: الأضواء المتلألئة (Sparkling Lights)
// ===========================================
function createSparklingLightsStyle(scene, camera, renderer) {
    // Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2000;
    const starsPositions = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount; i++) {
        const r = 15 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        starsPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        starsPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starsPositions[i * 3 + 2] = r * Math.cos(phi);
        
        const goldness = Math.random();
        if (goldness > 0.7) {
            starsColors[i * 3] = 1.0;
            starsColors[i * 3 + 1] = 0.8;
            starsColors[i * 3 + 2] = 0.2;
        } else {
            starsColors[i * 3] = 0.9;
            starsColors[i * 3 + 1] = 0.9;
            starsColors[i * 3 + 2] = 0.9;
        }
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Golden orbs
    const orbGroup = new THREE.Group();
    const orbCount = 5;
    
    for (let i = 0; i < orbCount; i++) {
        const orbGeo = new THREE.SphereGeometry(0.3 + Math.random() * 0.3, 16, 16);
        const orbMat = new THREE.MeshPhongMaterial({
            color: 0xD4AF37,
            emissive: 0x332200,
            transparent: true,
            opacity: 0.2
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        
        const angle = (i / orbCount) * Math.PI * 2;
        const radius = 3;
        orb.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius * 0.5,
            Math.sin(angle) * radius * 0.5
        );
        
        orbGroup.add(orb);
    }
    
    scene.add(orbGroup);
    
    // Lines
    const lineGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const points = [];
        for (let j = 0; j < 5; j++) {
            const t = j / 4;
            const angle = t * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(angle + i) * 2,
                Math.sin(angle * 2 + i) * 1.5,
                Math.sin(angle + i) * 1.5
            ));
        }
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xD4AF37, opacity: 0.1, transparent: true });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        lineGroup.add(line);
    }
    
    scene.add(lineGroup);
    camera.position.z = 10;
    
    function animate() {
        requestAnimationFrame(animate);
        stars.rotation.y += 0.0002;
        stars.rotation.x += 0.0001;
        orbGroup.rotation.y += 0.002;
        orbGroup.rotation.x += 0.001;
        lineGroup.rotation.y += 0.001;
        lineGroup.rotation.z += 0.0005;
        renderer.render(scene, camera);
    }
    animate();
}

// ===========================================
// النمط 4: النبضة (Nabla Pulse)
// ===========================================
function createNablaPulseStyle(scene, camera, renderer) {
    const light1 = new THREE.PointLight(0xD4AF37, 1, 15);
    light1.position.set(2, 3, 4);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(0xB8860B, 0.5, 15);
    light2.position.set(-3, -1, 2);
    scene.add(light2);
    
    const mainGroup = new THREE.Group();
    
    // Nabla symbol using lines
    const nablaGroup = new THREE.Group();
    
    const points1 = [new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(-1.3, -0.75, 0)];
    const points2 = [new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(1.3, -0.75, 0)];
    const points3 = [new THREE.Vector3(-1.3, -0.75, 0), new THREE.Vector3(1.3, -0.75, 0)];
    
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xD4AF37 });
    
    const line1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points1), lineMaterial);
    const line2 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points2), lineMaterial);
    const line3 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points3), lineMaterial);
    
    nablaGroup.add(line1);
    nablaGroup.add(line2);
    nablaGroup.add(line3);
    
    const glowPoints = [
        new THREE.Vector3(0, 1.5, 0),
        new THREE.Vector3(-1.3, -0.75, 0),
        new THREE.Vector3(1.3, -0.75, 0)
    ];
    
    glowPoints.forEach(pos => {
        const glowGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const glowMat = new THREE.MeshPhongMaterial({
            color: 0xD4AF37,
            emissive: 0x664400
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.copy(pos);
        nablaGroup.add(glow);
    });
    
    mainGroup.add(nablaGroup);
    
    // Pulse rings
    const pulseGroup = new THREE.Group();
    const ringCount = 3;
    
    for (let i = 0; i < ringCount; i++) {
        const ringGeo = new THREE.TorusGeometry(2 + i * 0.8, 0.02, 16, 64);
        const ringMat = new THREE.MeshPhongMaterial({
            color: 0xD4AF37,
            emissive: 0x221100,
            transparent: true,
            opacity: 0.2 - i * 0.05
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.rotation.z = 0.2 * i;
        pulseGroup.add(ring);
    }
    
    mainGroup.add(pulseGroup);
    
    // Particles
    const particleCount = 800;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const r = 3 + Math.random() * 4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        particlePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        particlePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        particlePos[i * 3 + 2] = r * Math.cos(phi);
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    
    const particleMat = new THREE.PointsMaterial({
        color: 0xD4AF37,
        size: 0.05,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);
    
    scene.add(mainGroup);
    camera.position.z = 8;
    
    let time = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        
        mainGroup.rotation.y += 0.001;
        nablaGroup.scale.setScalar(1 + Math.sin(time * 3) * 0.05);
        pulseGroup.rotation.y += 0.002;
        pulseGroup.rotation.z += 0.001;
        
        renderer.render(scene, camera);
    }
    animate();
}

// ===========================================
// النمط 5: الشفرة الذهبية (Golden Code)
// ===========================================
function createGoldenCodeStyle(scene, camera, renderer) {
    const mainGroup = new THREE.Group();
    
    // Center sphere with wireframe
    const centerGroup = new THREE.Group();
    
    const coreGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const coreMat = new THREE.MeshPhongMaterial({
        color: 0xD4AF37,
        emissive: 0x664400,
        transparent: true,
        opacity: 0.6
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    centerGroup.add(core);
    
    const wireframeGeo = new THREE.SphereGeometry(1.3, 16, 16);
    const wireframeMat = new THREE.MeshPhongMaterial({
        color: 0xD4AF37,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const wireframe = new THREE.Mesh(wireframeGeo, wireframeMat);
    centerGroup.add(wireframe);
    
    mainGroup.add(centerGroup);
    
    // Data streams
    const streamCount = 8;
    const streams = [];
    
    for (let i = 0; i < streamCount; i++) {
        const points = [];
        const segments = 20;
        
        for (let j = 0; j <= segments; j++) {
            const t = j / segments;
            const angle = t * Math.PI * 2;
            const radius = 2.5 + Math.sin(angle * 3) * 0.5;
            
            const x = Math.cos(angle + i) * radius;
            const y = Math.sin(angle * 2 + i) * 1.5;
            const z = Math.sin(angle + i) * 1.5;
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: 0xD4AF37,
            transparent: true,
            opacity: 0.15
        });
        
        const line = new THREE.Line(geometry, material);
        mainGroup.add(line);
        streams.push(line);
    }
    
    // Data points
    const dataCount = 600;
    const dataGeo = new THREE.BufferGeometry();
    const dataPos = new Float32Array(dataCount * 3);
    
    for (let i = 0; i < dataCount; i++) {
        const R = 3.5;
        const r = 1.2;
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        
        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const y = (R + r * Math.cos(v)) * Math.sin(u);
        const z = r * Math.sin(v);
        
        dataPos[i * 3] = x;
        dataPos[i * 3 + 1] = y;
        dataPos[i * 3 + 2] = z;
    }
    
    dataGeo.setAttribute('position', new THREE.BufferAttribute(dataPos, 3));
    
    const dataMat = new THREE.PointsMaterial({
        color: 0xD4AF37,
        size: 0.05,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const dataPoints = new THREE.Points(dataGeo, dataMat);
    mainGroup.add(dataPoints);
    
    // Sparkles
    const sparkleGeo = new THREE.BufferGeometry();
    const sparklePos = new Float32Array(300 * 3);
    
    for (let i = 0; i < 300; i++) {
        const r = 4 + Math.random() * 4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        sparklePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        sparklePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        sparklePos[i * 3 + 2] = r * Math.cos(phi);
    }
    
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
    
    const sparkleMat = new THREE.PointsMaterial({
        color: 0xFFD700,
        size: 0.1,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    mainGroup.add(sparkles);
    
    scene.add(mainGroup);
    camera.position.z = 9;
    
    let time = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        
        time += 0.005;
        
        mainGroup.rotation.y += 0.0005;
        mainGroup.rotation.x += 0.0002;
        
        centerGroup.rotation.y += 0.005;
        centerGroup.rotation.x += 0.003;
        
        core.scale.setScalar(1 + Math.sin(time * 5) * 0.05);
        
        streams.forEach((stream, index) => {
            stream.rotation.y += 0.001;
            stream.rotation.x += 0.0005 * (index % 2 === 0 ? 1 : -1);
        });
        
        dataPoints.rotation.y += 0.001;
        dataPoints.rotation.x += 0.0005;
        
        renderer.render(scene, camera);
    }
    animate();
}