if (!Detector.webgl) {
            Detector.addGetWebGLMessage();
        }

        var container;

        var camera, controls, scene, renderer;
        var lighting, ambient, keyLight, fillLight, backLight;

        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;

        init();
        animate();

        function init() {

            container = document.createElement('div');
            document.body.appendChild(container);

            /* Camera */
            
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 1000);
            camera.position.z = 140;

            /* Scene */

            scene = new THREE.Scene();
            lighting = false;

            ambient = new THREE.AmbientLight(0xffffff, 1.0);
            scene.add(ambient);

            keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
            keyLight.position.set(-100, 0, 100);

            fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
            fillLight.position.set(100, 0, 100);

            backLight = new THREE.DirectionalLight(0xffffff, 1.0);
            backLight.position.set(100, 0, -100).normalize();

            /* Model */

            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.setBaseUrl('assets/');
            mtlLoader.setPath('assets/');
            mtlLoader.load('pap-cup-obj.mtl', function (materials) {

                materials.preload();

                /*materials.materials.default.map.magFilter = THREE.NearestFilter;*/
                /*materials.materials.default.map.minFilter = THREE.LinearFilter;*/

                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.setPath('assets/');
                objLoader.load('pap-cup-obj.obj', function (object) {
                    object.translateZ( 0 );
                    object.translateX( 0 );
                    object.translateY( 0 );
                    pivot = new THREE.Object3D();
                    pivot.add(object);

                    /*var axisHelper = new THREE.AxisHelper(500);
                    scene.add(axisHelper);*/
                    scene.add(pivot);

                });

            });

            /* Renderer */

            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));

            container.appendChild(renderer.domElement);

            /* Controls */

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.enableZoom = true;
            controls.minPolarAngle = Math.PI/2;
            controls.maxPolarAngle = Math.PI/2;


            /* Events */

            window.addEventListener('resize', onWindowResize, false);
            window.addEventListener('keydown', onKeyboardEvent, false);

        }

        

        function onWindowResize() {

            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

        }

        function onKeyboardEvent(e) {

            if (e.code === '') {

                lighting = !lighting;

                if (lighting) {

                    ambient.intensity = 0.25;
                    scene.add(keyLight);
                    scene.add(fillLight);
                    scene.add(backLight);

                } else {

                    ambient.intensity = 1.0;
                    scene.remove(keyLight);
                    scene.remove(fillLight);
                    scene.remove(backLight);

                }

            }

        }

        function animate() {

            requestAnimationFrame(animate);

            controls.update();

            render();
            pivot.rotation.y += 0.015;

        }

        function render() {

            renderer.render(scene, camera);

        }