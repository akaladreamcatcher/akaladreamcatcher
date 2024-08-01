import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';



import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const cameraPositions = [
    { position: new THREE.Vector3(37, 5, 100), lookAt: new THREE.Vector3(30, 20, 50) },
    { position: new THREE.Vector3(37, 5, 100), lookAt: new THREE.Vector3(30, 10, 100) },
    { position: new THREE.Vector3(33, 3, 103.5), lookAt: new THREE.Vector3(25, 1, 103.5) },
    { position: new THREE.Vector3(32, 12, 103.5), lookAt: new THREE.Vector3(10, 0, 103.5) },
    { position: new THREE.Vector3(33, 5, 100), lookAt: new THREE.Vector3(30, 4, 102) },
    { position: new THREE.Vector3(33, 5, 100), lookAt: new THREE.Vector3(30, 4, 102) },

    { position: new THREE.Vector3(40, 10, 115), lookAt: new THREE.Vector3(27, 0, 115) },
    { position: new THREE.Vector3(40, 10, 115), lookAt: new THREE.Vector3(27, 0, 115) },
    { position: new THREE.Vector3(40, 10, 115), lookAt: new THREE.Vector3(27, 0, 115) },
    { position: new THREE.Vector3(37, 5, 100), lookAt: new THREE.Vector3(30, 15, 110) },
    { position: new THREE.Vector3(37, 5, 100), lookAt: new THREE.Vector3(30, 4, 105) },
    { position: new THREE.Vector3(37, 5, 100), lookAt: new THREE.Vector3(30, 5, 80) },
    { position: new THREE.Vector3(37, 5, 100), lookAt: new THREE.Vector3(30, 5, 100) }
];


const ThreeScene = ({ currentSection, numberOfKids, numberOfCars, numberOfhouses }) => {
    const mountRef = useRef(null);
    const camera = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
    const renderer = useRef(new THREE.WebGLRenderer({ antialias: true, alpha: true }));
   
    const scene = useRef(new THREE.Scene()); // Use useRef to persist the scene object
    const initialLookAt = useRef(new THREE.Vector3()); // Store initial lookAt position
    const dummyLookAt = useRef(new THREE.Vector3());
    const kidMeshes = useRef([]); // Store references to kid meshes
    const prevNumberOfKids = useRef(numberOfKids);

    const carMeshes = useRef([]); // Store references to car meshes
    const houseMeshes = useRef([]); // Store references to house meshes


    // Create a directional light - color, intensity
    var sunLight = new THREE.PointLight(0xffffff, 0.01); // Soft white light
    sunLight.castShadow = true;
    

    sunLight.position.set(20, 200, 100); // The direction from the light to the origin

        // Set up the renderer once on component mount
        useEffect(() => {
            // Set up the renderer
            renderer.current.setPixelRatio(window.devicePixelRatio * 0.6);
            renderer.current.setSize(window.innerWidth, window.innerHeight);
            renderer.current.domElement.style.width = '100%';
            renderer.current.domElement.style.height = '100%';
            renderer.current.shadowMap.enabled = true;
            mountRef.current.appendChild(renderer.current.domElement);
    
            // Add the camera and a light to the scene
            scene.current.add(camera.current);
            const sunLight = new THREE.PointLight(0xffffff, 0.01, 100, 2);
            sunLight.position.set(20, 200, 100);
            sunLight.castShadow = true;
            scene.current.add(sunLight);
    
            // Handle resizing
            const handleResize = () => {
                camera.current.aspect = window.innerWidth / window.innerHeight;
                camera.current.updateProjectionMatrix();
                renderer.current.setSize(window.innerWidth, window.innerHeight);
            };
            window.addEventListener('resize', handleResize);
    
            // Animation loop
            const animate = () => {
                requestAnimationFrame(animate);
                // Update or manipulate your scene per frame here
                renderer.current.render(scene.current, camera.current);
            };
            animate();
    
            // Cleanup on unmount
            return () => {
                window.removeEventListener('resize', handleResize);
                mountRef.current.removeChild(renderer.current.domElement);
                renderer.current.dispose();
               };
        }, []); // Empty dependency array ensures this runs once on mount only













    useEffect(() => {
        const { position, lookAt } = cameraPositions[currentSection];

        // Animate camera position using GSAP
        gsap.to(camera.current.position, {
            x: position.x,
            y: position.y,
            z: position.z,
            ease: "power3.inOut",
            duration: 0.8
        });

        // Animate lookAt position using GSAP
        gsap.to(dummyLookAt.current, {
            x: lookAt.x,
            y: lookAt.y,
            z: lookAt.z,
            ease: "power3.inOut",
            duration: 0.8,
            onUpdate: () => {
                camera.current.lookAt(dummyLookAt.current);
            },
            onComplete: () => {
                initialLookAt.current.copy(lookAt);
                dummyLookAt.current.copy(lookAt);
            }
        });
    }, [currentSection]);




    const kidUrls = ["kid5.glb", "kid5.glb", "kid5.glb", "kid5.glb"]; // URLs for kid models only
    const objectProperties = [
        { x: 26, y: -7.5, z: 105, scale: 1.2, rotation: { y: Math.PI / 2 } },
        { x: 25.5, y: -7.5, z: 104, scale: 1.2, rotation: { y: 0 } },
        { x: 25.5, y: -7.5, z: 103, scale: 1.2, rotation: { y: Math.PI / 4 } },
        { x: 26, y: -7.5, z: 102, scale: 1.2, rotation: { y: Math.PI / 2 } }
    ];
    
    useEffect(() => {
        const loader = new GLTFLoader();
    
        kidUrls.forEach((url, index) => {
            loader.load(url, gltf => {
                gltf.scene.traverse(child => {
                    if (child.isMesh && !child.userData.outline) {
                        const colorIndex = (index * 16) % pastelColors.length;
                        const materialColors = [];
                        for (let i = 0; i < 16; i++) {
                            materialColors.push(pastelColors[(colorIndex + i) % pastelColors.length]);
                        }
    
                        const material = new THREE.ShaderMaterial({
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            uniforms: {
                                lightPosition: { value: lightPosition },
                                colors: { value: materialColors },
                            }
                        });
    
                        child.material = material;
    
                        // Outline
                        const outlineMaterial = new THREE.MeshBasicMaterial({
                            color: 0xffffff, // Outline color
                            side: THREE.BackSide
                        });
                        const outlineMesh = new THREE.Mesh(child.geometry, outlineMaterial);
                        outlineMesh.scale.multiplyScalar(1);
                        outlineMesh.userData.outline = true;
                        child.add(outlineMesh);
                    }
                });
    
                const sceneObject = gltf.scene;
                sceneObject.position.set(objectProperties[index].x, objectProperties[index].y - 10, objectProperties[index].z); // Start from a lower y position
                sceneObject.scale.set(objectProperties[index].scale, objectProperties[index].scale, objectProperties[index].scale);
                sceneObject.rotation.set(0, objectProperties[index].rotation.y, 0);
                scene.current.add(sceneObject); // Use scene.current to add objects
                kidMeshes.current[index] = sceneObject;
            }, undefined, error => console.error('An error happened while loading model:', error));
        });
    
        return () => {
            kidMeshes.current.forEach(mesh => {
                scene.current.remove(mesh); // Use scene.current to remove objects
               });
        };
    }, []);
    
    useEffect(() => {
        // Adjust kid positions based on numberOfKids
        kidMeshes.current.forEach((sceneObject, index) => {
            const targetY = objectProperties[index].y + (index < numberOfKids ? 10 : -10);
            if (sceneObject) {
                gsap.to(sceneObject.position, {
                    y: targetY,
                    ease: "elastic.out(1, 0.5)",
                    duration: 0.8
                });
            }
        });

        prevNumberOfKids.current = numberOfKids;
    });
    

    



     // Define the scene's fog
     const color = 0xffc400;  // White fog
     const near = 5;         // The minimum range at which the fog starts (in units of the scene)
     const far = 50;         // The maximum range at which the fog completely obscures objects
 
     // Linear fog
     scene.fog = new THREE.Fog(color, near, far);















    const carObjectProperties = [
        { x: 30, y: -2.0, z: 115.5, scale: 1.5, rotation: { x: 0, y: Math.PI / -6, z: 0 } },
        { x: 20, y: -2.2, z: 116.5, scale: 1.5, rotation: { x: 0, y: Math.PI / 2, z: 0 } },
        { x: 24, y: -2.1, z: 116.5, scale: 1.5, rotation: { x: 0, y: Math.PI / 4, z: 0 } },
        { x: 13, y: -2.0, z: 116.5, scale: 1.5, rotation: { x: 0, y: Math.PI / 2, z: 0 } },
    ];

    


    useEffect(() => {
        const loader = new GLTFLoader();
        const carUrls = ["car1.glb", "car2.glb", "car3.glb", "car4.glb"];


        carUrls.forEach((url, index) => {
            loader.load(url, gltf => {

                let meshIndex = 0;
                gltf.scene.traverse(child => {
                    if (child.isMesh && !child.userData.outline) {
                        const colorIndex = (index * 16) % pastelColors.length;
                        const materialColors = [];
                        for (let i = 0; i < 16; i++) {
                            materialColors.push(pastelColors[(colorIndex + i) % pastelColors.length]);
                        }
    
                        const material = new THREE.ShaderMaterial({
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            uniforms: {
                                lightPosition: { value: lightPosition },
                                colors: { value: materialColors },
                            }
                        });
    
                        child.material = material;
    
                        // Outline
                        const outlineMaterial = new THREE.MeshBasicMaterial({
                            color: 0xffffff, // Outline color
                            side: THREE.BackSide
                        });
                        const outlineMesh = new THREE.Mesh(child.geometry, outlineMaterial);
                        outlineMesh.scale.multiplyScalar(1);
                        outlineMesh.userData.outline = true;
                        child.add(outlineMesh);
    
                        meshIndex += 4;
                        if (meshIndex >= pastelColors.length) meshIndex = 0;
                    }
                }

            )
                const sceneObject = gltf.scene;
                sceneObject.position.set(carObjectProperties[index].x, carObjectProperties[index].y - 2, carObjectProperties[index].z);
                sceneObject.scale.set(carObjectProperties[index].scale, carObjectProperties[index].scale, carObjectProperties[index].scale);
                sceneObject.rotation.set(0, carObjectProperties[index].rotation.y, 0);
                scene.current.add(sceneObject); // Use scene.current to add objects
                carMeshes.current[index] = sceneObject;  // Store the entire scene object
            }, undefined, error => console.error('An error happened while loading model:', error));
        });

        return () => {
            carMeshes.current.forEach(mesh => {
                scene.current.remove(mesh); // Use scene.current to remove objects
            });
        };
    }, []);

    // Animate y position based on numberOfCars
    useEffect(() => {
        carMeshes.current.forEach((sceneObject, index) => {
            if (sceneObject) {
                const targetY = carObjectProperties[index].y + (index < numberOfCars ? 4 : 0); // Move up if car should be visible
                gsap.to(sceneObject.position, {
                    y: targetY,
                    ease: "ease.out(1, 0.1)",
                    duration: 0.8
                });
            }
        });
    }, [numberOfCars]);

    



    

    const houseObjectProperties = [
        { x: 10, y: -17.0, z: 102.5, scale: 0.18, rotation: { x: 0, y: Math.PI, z: 0 } },
        { x: 10, y: -17.2, z: 102.5, scale: 0.14, rotation: { x: 0, y: Math.PI, z: 0 } },
        { x: 7, y: -17.1, z: 102.5, scale: 0.16, rotation: { x: 0, y: Math.PI, z: 0 } },
        { x: 4, y: -17.2, z: 102.5, scale: 0.20, rotation: { x: 0, y: Math.PI, z: 0 } },
    ];

    


    useEffect(() => {
        const loader = new GLTFLoader();
        const houseUrls = ["1br.glb", "2br.glb", "3br.glb", "4br.glb"];
        let housesLoaded = 0;


        houseUrls.forEach((url, index) => {
            loader.load(url, gltf => {

                let meshIndex = 0;
                gltf.scene.traverse(child => {
                    if (child.isMesh && !child.userData.outline) {
                        const colorIndex = (index * 16) % pastelColors.length;
                        const materialColors = [];
                        for (let i = 0; i < 16; i++) {
                            materialColors.push(pastelColors[(colorIndex + i) % pastelColors.length]);
                        }
    
                        const material = new THREE.ShaderMaterial({
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            uniforms: {
                                lightPosition: { value: lightPosition },
                                colors: { value: materialColors },
                            }
                        });
    
                        child.material = material;
    
                        // Outline
                        const outlineMaterial = new THREE.MeshBasicMaterial({
                            color: 0xffffff, // Outline color
                            side: THREE.BackSide
                        });
                        const outlineMesh = new THREE.Mesh(child.geometry, outlineMaterial);
                        outlineMesh.scale.multiplyScalar(1);
                        outlineMesh.userData.outline = true;
                        child.add(outlineMesh);
    
                        meshIndex += 4;
                        if (meshIndex >= pastelColors.length) meshIndex = 0;
                    }
                }

            )
                const sceneObject = gltf.scene;
                sceneObject.position.set(houseObjectProperties[index].x, houseObjectProperties[index].y - 30, houseObjectProperties[index].z);
                sceneObject.scale.set(houseObjectProperties[index].scale, houseObjectProperties[index].scale, houseObjectProperties[index].scale);
                sceneObject.rotation.set(0, houseObjectProperties[index].rotation.y, 0);
                scene.current.add(sceneObject); // Use scene.current to add objects
                houseMeshes.current[index] = sceneObject;  // Store the entire scene object
                housesLoaded++;
                if (housesLoaded === houseUrls.length) {
                    updatePositions(); // Ensure positions are correct after all models are loaded
                }
            }, undefined, error => console.error('An error happened while loading model:', error));
        });

        return () => {
            houseMeshes.current.forEach(sceneObject => {
                scene.current.remove(sceneObject);
            });
        };
    }, [numberOfhouses]); // Dependency on numberOfhouses ensures reload on change

    const updatePositions = () => {
        houseMeshes.current.forEach((sceneObject, index) => {
            const targetY = index < numberOfhouses ? houseObjectProperties[index].y + 20 : houseObjectProperties[index].y - 30;
            gsap.to(sceneObject.position, {
                y: targetY,
                ease: "ease.out(1, 0.2)",
                duration: 0.5
            });
        });
    };

    useEffect(() => {
        if (houseMeshes.current.length > 0) {
            updatePositions();
        }
    }, [numberOfhouses]);


    







 
    const pastelColors = [
        new THREE.Color('#ff9166'), // Starting color, bright yellow
        new THREE.Color('#ffd24d'), // Transition from yellow to lighter yellow
        new THREE.Color('#ffe199'), // Lighter yellow
        new THREE.Color('#fff0e6'), // Very light yellow, nearing white
        new THREE.Color('#fff5e6'), // Closer to white with a hint of yellow
        new THREE.Color('#fff8e6'), // Even closer to white
        new THREE.Color('#fff9e6'), // Subtle yellowish tint
        new THREE.Color('#fffbe6'), // Almost indistinguishable from white
        new THREE.Color('#fffce6'), // Nearing pure white
        new THREE.Color('#fffde6'), // Very close to white
        new THREE.Color('#fffee6'), // Almost white, just a hint of color
        new THREE.Color('#fffef6'), // Nearly pure white
        new THREE.Color('#fffff5'), // Almost white
        new THREE.Color('#fffffa'), // Almost pure white
        new THREE.Color('#fffffd'), // Just shy of pure white
        new THREE.Color('#ffffff')  // Pure white
    ];
    
        
    
    









// Vertex Shader
const vertexShader = `
varying vec3 vNormal;
varying vec3 vWorldPosition;
uniform vec3 lightPosition;
varying vec4 vLightSpacePos;

uniform mat4 lightSpaceMatrix;


void main() {
    vNormal = normalize(normalMatrix * normal); // Transform normal to world space
    vec4 worldPosition = modelMatrix * vec4(position, 1.0); // Calculate world position of the vertex
    vWorldPosition = worldPosition.xyz;
    vLightSpacePos = lightSpaceMatrix * worldPosition;


    gl_Position = projectionMatrix * viewMatrix * worldPosition; // Transform vertex to clip space
}
`;

// Fragment Shader
const fragmentShader = `
precision mediump float; // Lowering precision can help performance on mobile and web platforms

varying vec3 vNormal;
varying vec3 vWorldPosition;
uniform vec3 lightPosition;
uniform vec3 colors[16]; // Array of sixteen colors
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
uniform sampler2D shadowMap;
uniform mat4 lightSpaceMatrix;
varying vec4 vLightSpacePos;

float shadowCalculation(vec4 lightSpacePosition) {
    vec3 projCoords = lightSpacePosition.xyz / lightSpacePosition.w;
    projCoords = 0.5 * projCoords + 0.5;
    float closestDepth = texture2D(shadowMap, projCoords.xy).r;
    float currentDepth = projCoords.z;
    float bias = 0.005; // Reduced bias
    return currentDepth - bias > closestDepth ? 0.5 : 1.0; // Simplified shadow calculation
}

void main() {
    vec3 lightDir = normalize(lightPosition - vWorldPosition);
    float lightIntensity = max(dot(vNormal, lightDir), 0.0); // Simplify the light calculation

    float shadow = shadowCalculation(vLightSpacePos);
    lightIntensity *= shadow;

    int index = int(clamp(lightIntensity * 15.0, 0.0, 14.0));
    vec3 color = colors[index]; // Removed color blending for performance

    float fogFactor = smoothstep(fogNear, fogFar, length(vWorldPosition - cameraPosition));
    vec3 foggedColor = mix(color, fogColor, fogFactor); // Apply fog

    gl_FragColor = vec4(foggedColor, 1.0);
}


`;

// Ensure you define the `fogColor`, `fogNear`, and `fogFar` uniforms, and pass them to your shader, along with updating the `lightPosition` as necessary.



        const lightPosition = new THREE.Vector3(0, 400, 100); // Example light position

// Ensure the colors array in your Three.js setup is populated correctly and that the light position is being updated if necessary.








const sceneObjectProperties = [
    { x: -30, y: 2, z: 10, scale: 5, rotation: { x: 0, y: 0, z: 0 } },
    { x: -30, y: 2, z: 12, scale: 5, rotation: { x: 0, y: 0, z: 0 } },
    { x: -30, y: 2, z: -75, scale: 5, rotation: { x: 0, y: 0, z: 0 } },
    { x: -30, y: 2, z: -169, scale: 5, rotation: { x: 0, y: 0, z: 0 } },

    { x: 10, y: 3, z: 42, scale: 0.8, rotation: { x: 0, y: Math.PI / 2, z: 0 } },
    { x: 11, y: 0, z: 46, scale: 1, rotation: { x: 0, y: 0, z: 0 } },

    { x: 12, y: 0, z: 0.5, scale: 1.2, rotation: { x: 0, y: Math.PI / 4, z: 0 } },
    { x: 13, y: 0, z: 0.5, scale: 0.8, rotation: { x: 0, y: Math.PI / 2, z: 0 } },
    { x: 14, y: 0, z: 0.5, scale: 1, rotation: { x: 0, y: 0, z: 0 } },
    { x: 14, y: 0, z: 0.5, scale: 1, rotation: { x: 0, y: 0, z: 0 } },


];



useEffect(() => {
    const loader = new GLTFLoader();
    const materials = []; // Array to store shared materials

    const createMaterial = (index) => {
        const colorIndex = (index * 16) % pastelColors.length;
        const materialColors = pastelColors.slice(colorIndex, colorIndex + 16);

        return new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                lightPosition: { value: lightPosition },
                colors: { value: materialColors },
                fogColor: { value: new THREE.Color(0xffffff) },
                fogNear: { value: 40 },
                fogFar: { value: 80 },
                shadowMap: { value: sunLight.shadow.map },
                lightSpaceMatrix: { value: new THREE.Matrix4() }
            }
        });
    };

    const modelUrls = [
        "neighborhoodstars.glb",
        "neighborhood.glb",
        "neighborhood.glb",
        "neighborhood.glb",
    ];

    modelUrls.forEach((url, index) => {
        // Check if a material for this index has already been created
        if (!materials[index]) {
            materials[index] = createMaterial(index);
        }

        loader.load(url, gltf => {
            gltf.scene.traverse(child => {
                if (child.isMesh && !child.userData.outline) {
                    child.material = materials[index];
                    child.receiveShadow = true;
                    child.castShadow = true;

                    // Outline
                    const outlineMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffc400,
                        side: THREE.BackSide
                    });
                    const outlineMesh = new THREE.Mesh(child.geometry, outlineMaterial);
                    outlineMesh.scale.multiplyScalar(1.03);
                    outlineMesh.userData.outline = true;
                    child.add(outlineMesh);
                }
            });

            gltf.scene.visible = true;
            const props = sceneObjectProperties[index];
            gltf.scene.position.set(props.x, props.y, props.z);
            gltf.scene.scale.set(props.scale, props.scale, props.scale);
            gltf.scene.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z);
            scene.current.add(gltf.scene);
        }, undefined, error => console.error('An error happened while loading model:', error));
    });
}, [scene, pastelColors, lightPosition, sunLight.shadow.map]); // Updated dependencies




    return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

export default ThreeScene;
