import React, { Component } from 'react';
import Field from './fieldComponent'
import * as THREE from 'three'
import OrbitControls from 'threejs-orbit-controls';
import * as OBJLoader from 'three-obj-loader';
import { SpriteText2D, textAlign } from 'three-text2d'

// ----- modele -----
import rockModel from '../../assets/models/stone.obj'
import rockText from '../../assets/models/stone.jpg'
import bushModel from '../../assets/models/bush.obj'
import bushText from '../../assets/models/bush.png'
import treeModel from '../../assets/models/tree.obj'
import treeText from '../../assets/models/tree.png'
import tree2Model from '../../assets/models/tree1.obj'
import tree2Text from '../../assets/models/tree1.png'
import warriorModel from '../../assets/models/warrior.obj'
import warriorText from '../../assets/models/warrior.png'
import wizardModel from '../../assets/models/wizard.obj'
import wizardText from '../../assets/models/wizard.png'
import wallText from '../../assets/models/wallTexture.jpg'

OBJLoader(THREE);
//TextSprite(THREE)


export default class ThreeContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            board: this.props.board,
            playerModels: [],
        }
        this.obstacleModels= [ // tablica modeli przeszkód
            [
                new THREE.Group(),
                new THREE.Group(),
                new THREE.Group(),
                new THREE.Group(),
            ],
            new THREE.Group(), // sciany
        ]
        this.boxGeometry = new THREE.BoxGeometry(10, 1, 10); // geometria pól
        this.three = THREE;


    }

    componentDidMount() {
        // ----- loader modeli i textur -----
        this.THREE = THREE;
        this.loader = new this.THREE.OBJLoader()
        this.textureLoader = new THREE.TextureLoader();

        this.initModels();

        // Rozmiar 
        this.WIDTH = 85 * window.innerWidth / 100;
        this.HEIGHT = window.innerHeight;

        //  -----  DOM element  ----
        const container = this.threeRootElement;

        // kliknięcie i inne akcję na polach 
        container.addEventListener("mousedown", (e) => { this.afterClick(e, raycaster) }, true);
        container.addEventListener("mouseout", (e) => { this.afterClick(e, raycaster) }, true);
        container.addEventListener("mousemove", (e) => { this.afterClick(e, raycaster) }, true);


        // ----- renderer -----
        this.renderer = new THREE.WebGLRenderer({ antialias: true }); // zmiękczanie krawędzi
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.setClearColor(0xffffff, 0);

        container.appendChild(this.renderer.domElement);

        // ----- reycaster -----
        var raycaster = new THREE.Raycaster();

        // ----- scena -----
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x282c34);

        // ----- swiatła -----
        var light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
        this.scene.add(light);

        // ----- camera -----
        this.camera = new THREE.PerspectiveCamera(45, this.WIDTH / this.HEIGHT, 1, 1000);
        this.camera.position.set(0, 220, 120)
        this.camera.lookAt(100, 0, 100)
        this.scene.add(this.camera);

        window.addEventListener("resize", () => { // zmiana wielkosci po resizie
            this.onResize()
        });

        // ----- kontrola camery -----
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enabled = true;
        this.controls.maxDistance = 500;
        this.controls.minDistance = 0;

        // ----- plansza -----
        this.boardGroup = new THREE.Group();
        this.scene.add(this.boardGroup);
        this.updateBoard()

        // ----- blokada scrolli -----
        this.renderer.domElement.onwheel = function (event) { event.preventDefault(); };
        this.renderer.domElement.onmousewheel = function (event) { event.preventDefault(); };

        this.start();
    }

    componentWillUnmount = () => {
        // zatrzymanie pętli 
        this.stop();
    }

    // --------------- rozpoczęcie pętli ---------------
    start = () => {

        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    // --------------- zatrzymanie pętli ---------------
    stop = () => {
        cancelAnimationFrame(this.frameId)
    }

    // ---------------- renderowanie sceny -----------
    renderScene = () => {

        this.renderer.render(this.scene, this.camera)
    }

    // ----------------- pętla -------------------
    animate = () => {

        // ----- kontrola camery -----

        if (this.camera.position.y < 0) this.camera.position.y = 0;
        this.controls.update();

        this.renderScene();

        this.frameId = window.requestAnimationFrame(this.animate)
    }

    componentDidUpdate = () => {
        this.updateBoard();
    }

    // --------------- dynamiczna zmiana wielkosci planszy po resizie ---------------
    onResize = () => {
        this.WIDTH = 85 * window.innerWidth / 100;
        this.HEIGHT = window.innerHeight;

        this.camera.aspect = this.WIDTH / this.HEIGHT;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.WIDTH, this.HEIGHT);
    }

    // --------------- akcję po kliknięciu na planszę ---------------
    afterClick = (e, raycaster) => {
        let vector = new THREE.Vector3();
        e.preventDefault();

        let mouse = new THREE.Vector2();
        var selectedObject;

        mouse.x = (e.clientX / Number(this.WIDTH)) * 2 - 1;
        mouse.y = - (e.clientY / this.HEIGHT) * 2 + 1;

        vector.set(mouse.x, mouse.y, 0.5);
        vector.unproject(this.camera);

        raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());

        var intersects = raycaster.intersectObjects(this.boardGroup.children); //array

        // ---- kliknięte elementy -----

        if (intersects.length > 0) {
            selectedObject = intersects[0].object;

            // ----- ustalenie typu akcji -----
            let action = '';
            switch (e.type) {
                case 'mousedown':
                    if (Number(e.button) === 0)
                        action = 'click'
                    else
                        action = 'shoot'
            }
            if (action !== '') {
                this.props.getPlayerByTabIndex(selectedObject.userData.number, selectedObject.userData.coords, action)
            }
        }
        else {
            this.props.outFunction();
        }
    }

    // --------------- ladowanie modeli -----------
    loadModel = async (modelSrc, group, material, scale) => {
        let map = this.textureLoader.load(material);
        let texture = new THREE.MeshPhongMaterial({ map: map, color: 0xffffff });
        await this.loader.load(modelSrc, (object) => {
            object.traverse(function (node) {

                if (node.isMesh) node.material = texture;

            });
            object.scale.set(scale.x, scale.y, scale.z)
            group.add(object)
        })
    }

    // ----------------- tworzenie modeli --------

    initModels = () => {
        // ----- model i textura przeszkody -----
        this.loadModel(rockModel, this.obstacleModels[0][0], rockText, { x: 0.2, y: 0.125, z: 0.2 }) // kamien
        this.loadModel(treeModel, this.obstacleModels[0][1], treeText, { x: 0.125, y: 0.125, z: 0.125 }) // drzewo 1
        this.loadModel(tree2Model, this.obstacleModels[0][2], tree2Text, { x: 1.5, y: 1.5, z: 1.5 }) // drzewo 2
        this.loadModel(bushModel, this.obstacleModels[0][3], bushText, { x: 0.08, y: 0.08, z: 0.08 }) // drzewo 3

        // model ściany

        let geometry = new THREE.BoxGeometry(10, 12, 6);
        let texture = new THREE.TextureLoader().load( wallText );
        let material = new THREE.MeshBasicMaterial({  map: texture});
        let wall = new THREE.Mesh(geometry, material);
        this.obstacleModels[1]= wall;

        // model i textura gracza 
        this.warriorModel = new THREE.Group()
        this.loadModel(warriorModel, this.warriorModel, warriorText, { x: 11, y: 11, z: 11 })

        this.wizardModel = new THREE.Group()
        this.loadModel(wizardModel, this.wizardModel, wizardText, { x: 23, y: 23, z: 23 })
    }




    // -------------- tworzenie napisów ----------

    textInit = (text, x, y, z) => {
        var sprite = new SpriteText2D(text, { align: textAlign.center, font: '50px Arial', fillStyle: 'red', antialias: true })
        sprite.scale.set(0.1, 0.1, 0.1)
        sprite.position.set(x, y, z)
        return sprite;
    }




    // ----- wyswietlanie tablicy(planszy) -----
    updateBoard = () => {

        // ----- czyszczenie planszy -----
        this.scene.remove(this.boardGroup)

        this.boardGroup = new THREE.Group();
        var startX = - this.props.board.length / 2 * 12 // wspolrzedne początkowe
        var startZ = - this.props.board.length / 2 * 12

        this.state.board.map((i, indexI) => {
            var element = i.map((j, indexJ) => {
                var cube = new Field(j.number, this.boxGeometry).getCube()
                // dodanie do swiata stworzonego elementu
                this.boardGroup.add(cube)  // tworzenie pol tablicy, ktore beda reagowa na eventy myszy
                cube.userData = { coords: [indexI, indexJ], number: j.number, name: j.name, model: j.model }
                cube.position.set(startX + indexJ * 12, 0, startZ + indexI * 12)

                // przeszkody
                if (Number(j.number) === 4 && j.model) {
                    var obstacle;

                    if (this.props.obstaclesType === 'nature') {
                        obstacle = this.obstacleModels[0][Number(j.model) - 1].clone()
                        obstacle.position.set(startX + indexJ * 12, 1, startZ + indexI * 12)

                        if (Number(j.model) === 2) obstacle.position.set(startX + indexJ * 12 + 11, 1, startZ + indexI * 12 + 50);
                    }
                    
                    else if (this.props.obstaclesType === 'walls') {
                        obstacle = this.obstacleModels[1].clone()
                        obstacle.position.set(startX + indexJ * 12, 6, startZ + indexI * 12-2)
                    }

                    this.boardGroup.add(obstacle)
                }

                // gracze
                if (Number(j.number) === 3 && j.model) {
                    var warrior
                    if (Number(j.model) === 2) {
                        warrior = this.warriorModel.clone()
                        warrior.position.set(startX + indexJ * 12, 0, startZ + indexI * 12 + 6)
                    }

                    else if (Number(j.model) === 1) {
                        warrior = this.wizardModel.clone()
                        warrior.rotateY(-Math.PI / 2)
                        warrior.position.set(startX + indexJ * 12, 0, startZ + indexI * 12)
                    }
                    this.boardGroup.add(warrior)
                    this.boardGroup.add(this.textInit(String(j.name), startX + indexJ * 12, 25, startZ + indexI * 12))
                }
            });
        })
        this.scene.add(this.boardGroup)
    }

    render() {
        return (
            <div>
                <div style={{ position: 'fixed', left: 0 }} ref={element => this.threeRootElement = element} />
                <canvas ref={element => this.canvas = element} width={20} height={10} />
            </div>


        );
    }
}