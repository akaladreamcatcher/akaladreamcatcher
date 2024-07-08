import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ShaderMaterial, TextureLoader } from 'three';


import { MathUtils } from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const cameraPositions = [
    { position: new THREE.Vector3(37, 5, 100), lookAt: new THREE.Vector3(30, 5, 50) },
    { position: new THREE.Vector3(37, 5, 100), lookAt: new THREE.Vector3(30, 5, 100) },
    { position: new THREE.Vector3(32, 5, 100), lookAt: new THREE.Vector3(30, 3, 102) },
    { position: new THREE.Vector3(33, 5, 100), lookAt: new THREE.Vector3(30, 4, 102) },
    { position: new THREE.Vector3(33, 5, 100), lookAt: new THREE.Vector3(30, 4, 102) },
    { position: new THREE.Vector3(33, 5, 100), lookAt: new THREE.Vector3(30, 4, 102) },

    { position: new THREE.Vector3(35, 12, 100), lookAt: new THREE.Vector3(25, 0, 105) },
    { position: new THREE.Vector3(35, 12, 100), lookAt: new THREE.Vector3(25, 0, 105) },
    { position: new THREE.Vector3(35, 12, 100), lookAt: new THREE.Vector3(25, 0, 105) },
    { position: new THREE.Vector3(37, 5, 100), lookAt: new THREE.Vector3(30, 15, 110) },
    { position: new THREE.Vector3(37, 5, 100), lookAt: new THREE.Vector3(30, 4, 105) },
    { position: new THREE.Vector3(37, 5, 100), lookAt: new THREE.Vector3(30, 5, 100) },
    { position: new THREE.Vector3(37, 5, 100), lookAt: new THREE.Vector3(30, 5, 100) }
];


const ThreeScene = ({ currentSection, numberOfKids, numberOfCars }) => {
    const mountRef = useRef(null);
    const camera = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const scale = 0.75;
    const pixelRatio = window.devicePixelRatio * 0.5;
    const width = window.innerWidth * scale;
    const height = window.innerHeight * scale;
    
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    const scene = new THREE.Scene();
    const initialLookAt = useRef(new THREE.Vector3()); // Store initial lookAt position
    const dummyLookAt = useRef(new THREE.Vector3());
    const kidMeshes = useRef([]); // Store references to kid meshes
    const carMeshes = useRef([]); // Store references to car meshes


    // Create a directional light - color, intensity
    var sunLight = new THREE.PointLight(0xffffff, 0.01); // Soft white light
    sunLight.castShadow = true;
    

    sunLight.position.set(20, 200, 100); // The direction from the light to the origin

    // Enable casting shadows
    sunLight.castShadow = true;
    renderer.shadowMap.enabled = true;







    scene.add(sunLight);





    useEffect(() => {
        scene.add(camera.current);
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);



        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera.current);
        };
        animate();

        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    useEffect(() => {
        const { position, lookAt } = cameraPositions[currentSection];

        // Animate camera position using GSAP
        gsap.to(camera.current.position, {
            x: position.x,
            y: position.y,
            z: position.z,
            ease: "power3.inOut",
            duration: 4
        });

        // Animate lookAt position using GSAP
        gsap.to(dummyLookAt.current, {
            x: lookAt.x,
            y: lookAt.y,
            z: lookAt.z,
            ease: "power3.inOut",
            duration: 4,
            onUpdate: () => {
                camera.current.lookAt(dummyLookAt.current);
            },
            onComplete: () => {
                initialLookAt.current.copy(lookAt);
                dummyLookAt.current.copy(lookAt);
            }
        });
    }, [currentSection]);

    useEffect(() => {
        const maxAngleRadians = THREE.MathUtils.degToRad(5);  // Convert max angle from degrees to radians

        const handleMouseMove = event => {
            const x = (event.clientX / window.innerWidth - 0.5) * 2;  // Normalized [-1, 1]
            const y = -(event.clientY / window.innerHeight - 0.5) * 2;  // Normalized [-1, 1], inverted

            // Calculate the potential new look at position based on mouse input
            const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.current.quaternion);
            const cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.current.quaternion);

            // Determine offset using trigonometric projection, ensuring it does not exceed the max angle
            const offsetX = cameraRight.multiplyScalar(Math.tan(x * maxAngleRadians) * camera.current.position.distanceTo(initialLookAt.current));
            const offsetY = cameraUp.multiplyScalar(Math.tan(y * maxAngleRadians) * camera.current.position.distanceTo(initialLookAt.current));

            const newLookAt = new THREE.Vector3().copy(initialLookAt.current).add(offsetX).add(offsetY);

            // Ensure the new look at does not deviate more than 10 degrees from the original
            let angle = initialLookAt.current.angleTo(new THREE.Vector3().subVectors(newLookAt, camera.current.position));
            if (angle > maxAngleRadians) {
                // Scale back to max allowable angle if exceeded
                const correctionFactor = maxAngleRadians / angle;
                newLookAt.sub(camera.current.position).multiplyScalar(correctionFactor).add(camera.current.position);
            }

            gsap.to(dummyLookAt.current, {
                x: newLookAt.x,
                y: newLookAt.y,
                z: newLookAt.z,
                ease: "power3.out",
                duration: 3,
                onUpdate: () => camera.current.lookAt(dummyLookAt.current)
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [currentSection]);  // Reinitialize when the section changes









    useEffect(() => {
        const loader = new GLTFLoader();
        const kidUrls = ["kid5.glb", "kid5.glb", "kid5.glb", "kid5.glb"]; // URLs for kids models only
        const objectProperties = [
            { x: 26, y: 2.5, z: 105, scale: 1.2, rotation: { y: Math.PI / 2 } },
            { x: 25.5, y: 2.5, z: 104, scale: 1.2, rotation: { y: 0 } },
            { x: 25.5, y: 2.5, z: 103, scale: 1.2, rotation: { y: Math.PI / 4 } },
            { x: 26, y: 2.5, z: 102, scale: 1.2, rotation: { y: Math.PI / 2 } }
        ];

        kidUrls.forEach((url, index) => {
            loader.load(url, gltf => {
                const mesh = gltf.scene.children.find(child => child.isMesh);

                
                mesh.material.transparent = true;
                mesh.material.opacity = 0.0;  // Start with models hidden
                // Set position, scale, and rotation
                mesh.position.set(objectProperties[index].x, objectProperties[index].y, objectProperties[index].z);
                mesh.scale.set(objectProperties[index].scale, objectProperties[index].scale, objectProperties[index].scale);
                mesh.rotation.set(0, objectProperties[index].rotation.y, 0);
                scene.add(mesh);
                kidMeshes.current[index] = mesh;
            }, undefined, error => console.error('An error happened while loading model:', error));
        });

        return () => {
            kidMeshes.current.forEach(mesh => {
                scene.remove(mesh);
            });
        };
    }, []);

    // Animate opacity based on numberOfKids
    useEffect(() => {
        kidMeshes.current.forEach((mesh, index) => {
            if (mesh) {
                gsap.to(mesh.material, {
                    opacity: index < numberOfKids ? 1 : 0, // Only make as many kids visible as the state specifies
                    duration: 1
                });
            }
        });
    }, [numberOfKids]);

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
                scene.add(sceneObject);
                carMeshes.current[index] = sceneObject;  // Store the entire scene object
            }, undefined, error => console.error('An error happened while loading model:', error));
        });

        return () => {
            carMeshes.current.forEach(sceneObject => {
                scene.remove(sceneObject);
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
                    ease: "elastic.out(1, 0.3)",
                    duration: 1.5
                });
            }
        });
    }, [numberOfCars]);

    







 
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
precision highp float; // or highp if needed for your calculations

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
    // Ensure coordinates are mapped correctly
    projCoords = 0.5 * projCoords + 0.5;
    float closestDepth = texture2D(shadowMap, projCoords.xy).r; // Using red channel if shadow map is depth
    float currentDepth = projCoords.z;
    float bias = 0.4; // Adjust bias based on your scene scale and needs
    float shadow = currentDepth - bias > closestDepth ? 0.6 : 1.0;
    return shadow;
}





// Improved noise function that generates more irregular, organic patterns
float noise(vec3 pos) {
    vec3 ipos = floor(pos * .1); // Using an odd number to avoid grid alignment
    vec3 fpos = fract(pos * .02);

    // Use a rotated grid in the fract space to create irregularity
    fpos = fpos * fpos * (3.0 - 2.0 * fpos); // Smootherstep interpolation
    vec3 rotated = vec3(fpos.x * cos(0.5) - fpos.y * sin(0.5), fpos.x * sin(0.5) + fpos.y * cos(0.5), fpos.z);

    float res = fract(sin(dot(ipos + rotated, vec3(12.9898, 78.233, 54.53))) * 43758.5453);
    res *= 1.0 - smoothstep(0.2, 0.8, length(rotated - 0.5)); // Make the shape of the noise more irregular
    return res;
}

vec3 getShadeColor(float lightIntensity) {
    int index = int(clamp(lightIntensity * 12.0, 0.0, 14.99)); // Determine base index
    float blend = fract(lightIntensity * 0.05); // Calculate fractional part for blending

    // Blend between selected color and the next one in the array to create a soft transition
    return mix(colors[index], colors[min(index + 1, 15)], smoothstep(0.3, .3, blend));
}

void main() {
    vec3 lightDir = normalize(lightPosition - vWorldPosition); // Calculate light direction in world space
    float lightIntensity = max(dot(vNormal, lightDir), 0.05); // Calculate intensity of light based on world space normals

    float shadow = shadowCalculation(vLightSpacePos);
    lightIntensity *= shadow; // Modulate intensity by shadow

    vec3 color = getShadeColor(clamp(lightIntensity, 0.0, 1.0));

    // Calculate fog effect
    float fogFactor = smoothstep(fogNear, fogFar, length(vWorldPosition - cameraPosition));
    vec3 foggedColor = mix(color, fogColor, fogFactor); // Blend the object color with fog color based on distance

    gl_FragColor = vec4(foggedColor, 1.0); // Output the fogged color
}
`;

// Ensure you define the `fogColor`, `fogNear`, and `fogFar` uniforms, and pass them to your shader, along with updating the `lightPosition` as necessary.



        const lightPosition = new THREE.Vector3(0, 400, 100); // Example light position

// Ensure the colors array in your Three.js setup is populated correctly and that the light position is being updated if necessary.












    useEffect(() => {
        const loader = new GLTFLoader();
        const modelUrls = [
            "neighborhoodstars.glb",
            "neighborhood.glb",
            "neighborhood.glb",
            "neighborhood.glb",
        ];


        modelUrls.forEach((url, index) => {
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
                                fogColor: { value: new THREE.Color(0xffffff) }, // Fog color
                                fogNear: { value: 40 },  // The minimum range at which the fog starts
                                fogFar: { value: 80 },   // The maximum range at which the fog completely obscures objects
                                shadowMap: { value: sunLight.shadow.map },
                                
                                lightSpaceMatrix: { value: new THREE.Matrix4() }
                        
                         
                            }
                        });

                        
    
                        child.material = material;
                        child.receiveShadow = true;
                        child.castShadow = true;


                        
    
                        // Outline
                        const outlineMaterial = new THREE.MeshBasicMaterial({
                            color: 0xffc400, // Outline color
                            side: THREE.BackSide
                        });
                        const outlineMesh = new THREE.Mesh(child.geometry, outlineMaterial);
                        outlineMesh.scale.multiplyScalar(1.03);
                        outlineMesh.userData.outline = true;
                        child.add(outlineMesh);
    
                        meshIndex += 4;
                        if (meshIndex >= pastelColors.length) meshIndex = 0;
                    }
                });


                const objectProperties = [
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
                gltf.scene.visible = true; // Make sure models are visible
                const props = objectProperties[index]; // Get properties from the array
                gltf.scene.position.set(props.x, props.y, props.z);
                gltf.scene.scale.set(props.scale, props.scale, props.scale);
                gltf.scene.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z);
                scene.add(gltf.scene);
            }, undefined, error => console.error('An error happened while loading model:', error));
        });
    }, [scene, pastelColors]);

    return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

export default ThreeScene;
