/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
// 23FI055 鈴木 章太

class ThreeJSContainer {
    scene;
    light;
    shootingStar;
    shootingStarActive = false;
    starGroup = null;
    renderer;
    camera;
    orbitControls;
    shootingStars = [];
    constructor() { }
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_0__.Color(0x495ed));
        renderer.shadowMap.enabled = true;
        // カメラ設定
        const camera = new three__WEBPACK_IMPORTED_MODULE_0__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        let yaw = Math.PI; // 左右回転
        let pitch = 0; // 上下回転
        const rotateSpeed = 0.05;
        function updateCameraDirection() {
            // 向いている方向を計算
            const direction = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
            camera.lookAt(camera.position.clone().clone().add(direction));
        }
        window.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    yaw += rotateSpeed;
                    break;
                case "ArrowRight":
                    yaw -= rotateSpeed;
                    break;
                case "ArrowUp":
                    pitch = Math.min(Math.PI / 2 - 0.1, pitch + rotateSpeed);
                    break;
                case "ArrowDown":
                    pitch = Math.max(-Math.PI / 2 + 0.1, pitch - rotateSpeed);
                    break;
            }
            updateCameraDirection();
        });
        this.createScene();
        const render = () => {
            this.updateShootingStars();
            updateCameraDirection();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
            renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_0__.Color(0x000000));
        };
        requestAnimationFrame(render);
        return renderer.domElement;
    };
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();
        // 星の作成
        const starCount = 2000;
        const r = 50;
        const colors = [0x1c7aff, 0xff0f2f, 0xffffff]; // 青,赤,白
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            const u = 2 * Math.PI * Math.random();
            const v = 2 * Math.PI * Math.random() - Math.PI / 2;
            const x = r * Math.cos(u) * Math.cos(v);
            const y = r * Math.sin(u) * Math.cos(v);
            const z = r * Math.sin(v);
            starPositions[i * 3] = x;
            starPositions[i * 3 + 1] = y;
            starPositions[i * 3 + 2] = z;
            // ランダムなカラー設定
            const randomColor = Math.random();
            let color = new three__WEBPACK_IMPORTED_MODULE_0__.Color(colors[2]);
            if (randomColor < 0.05) {
                color = new three__WEBPACK_IMPORTED_MODULE_0__.Color(colors[0]);
            }
            else if (0.05 <= randomColor && randomColor < 0.1) {
                color = new three__WEBPACK_IMPORTED_MODULE_0__.Color(colors[1]);
            }
            else {
            }
            starColors[i * 3] = color.r;
            starColors[i * 3 + 1] = color.g;
            starColors[i * 3 + 2] = color.b;
        }
        const starGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.BufferGeometry();
        starGeometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_0__.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new three__WEBPACK_IMPORTED_MODULE_0__.BufferAttribute(starColors, 3));
        const starMaterial = new three__WEBPACK_IMPORTED_MODULE_0__.PointsMaterial({
            size: 0.25,
            vertexColors: true,
            transparent: true,
            opacity: 0.9
        });
        const stars = new three__WEBPACK_IMPORTED_MODULE_0__.Points(starGeometry, starMaterial);
        this.starGroup = new three__WEBPACK_IMPORTED_MODULE_0__.Group();
        this.starGroup.add(stars);
        // 星の回転軸
        this.starGroup.rotation.x = three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(35);
        this.scene.add(this.starGroup);
        // 流れ星オブジェクトを複数生成
        const geo = new three__WEBPACK_IMPORTED_MODULE_0__.SphereGeometry(0.3, 16, 16);
        const mat = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({ color: 0xb0b9d5 });
        const mesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(geo, mat);
        mesh.visible = false;
        this.scene.add(mesh);
        this.shootingStars.push({
            mesh,
            active: false,
            startTime: 0,
            duration: 2000,
            startPos: new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(),
            endPos: new three__WEBPACK_IMPORTED_MODULE_0__.Vector3()
        });
        // 地面
        const radiusTop = 50; // 上面の半径
        const radiusBottom = 50; // 底面の半径
        const height = 3; // 厚み（高さ）
        const radialSegments = 50; // 円周分割数
        const cylinderGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        const cylinderMaterial = new three__WEBPACK_IMPORTED_MODULE_0__.MeshLambertMaterial({ color: 0x225522 });
        const cylinder = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(cylinderGeometry, cylinderMaterial);
        // 地面のように y = 0 に沿わせる
        cylinder.position.y = -height / 2;
        cylinder.receiveShadow = true;
        this.scene.add(cylinder);
        // 山（南）
        const mountainHeight = 10;
        const leftMountainHeight = 15;
        const mountainGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.ConeGeometry(15, mountainHeight, 8);
        const leftMountainGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.ConeGeometry(15, leftMountainHeight, 8);
        const mountainMaterial = new three__WEBPACK_IMPORTED_MODULE_0__.MeshStandardMaterial({ color: 0x225522 });
        for (let i = 0; i < 3; i++) {
            let mountain = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(mountainGeometry, mountainMaterial);
            mountain.position.set(15 * (i - 1), mountainHeight / 2, -20);
            if (i == 2) {
                mountain = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(leftMountainGeometry, mountainMaterial);
                mountain.position.set(15 * (i - 1), leftMountainHeight / 2, -20);
            }
            this.scene.add(mountain);
        }
        ;
        //真後ろの山(北)
        let northMountain = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(mountainGeometry, mountainMaterial);
        northMountain.position.set(0, mountainHeight / 2, 50);
        this.scene.add(northMountain);
        // 右の山（東）
        let eastMountain = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(mountainGeometry, mountainMaterial);
        eastMountain.position.set(30, mountainHeight / 2, 30);
        eastMountain.rotateY(Math.PI / 2);
        this.scene.add(eastMountain);
        // 左の山（西）
        let westMountain = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(mountainGeometry, mountainMaterial);
        westMountain.position.set(-30, mountainHeight / 2, 30);
        westMountain.rotateY(-Math.PI / 2);
        this.scene.add(westMountain);
        // 左の岩
        const stoneLeftHeight = 2;
        const leftStoneGeometory = new three__WEBPACK_IMPORTED_MODULE_0__.ConeGeometry(2, stoneLeftHeight, 4);
        const stoneMaterial = new three__WEBPACK_IMPORTED_MODULE_0__.MeshStandardMaterial({ color: 0x3f3c35 });
        let leftStone = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(leftStoneGeometory, stoneMaterial);
        leftStone.position.set(-3.5, stoneLeftHeight / 2, 23);
        this.scene.add(leftStone);
        // 右の岩
        const stoneRightHeight = 7;
        const rightStoneGeometory = new three__WEBPACK_IMPORTED_MODULE_0__.ConeGeometry(2, stoneRightHeight, 4);
        let rightStone = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(rightStoneGeometory, stoneMaterial);
        rightStone.position.set(3.5, stoneLeftHeight / 2, 23);
        rightStone.rotation.z = -Math.PI / 6;
        this.scene.add(rightStone);
        // ライト
        this.light = new three__WEBPACK_IMPORTED_MODULE_0__.DirectionalLight(0xffffff, 1);
        this.light.position.set(10, 20, 10);
        this.scene.add(this.light);
        this.scene.add(new three__WEBPACK_IMPORTED_MODULE_0__.AmbientLight(0x404040));
        let update = (time) => {
            if (this.starGroup) {
                this.starGroup.rotation.y -= 0.001; // 星の回転
            }
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
    startShootingStar(star) {
        // ランダムな開始・終了位置
        const startRandomX = Math.random();
        const endRandomX = Math.random();
        let startX = -30 + Math.random() * 40;
        let startY = 30 + Math.random() * 40;
        let endX = 30 + Math.random() * 40;
        let endY = -5 + Math.random() * 10;
        if (startRandomX > 0.5) {
            startX *= -1;
        }
        if (endRandomX > 0.5) {
            endX *= -1;
        }
        star.startPos.set(startX, startY, -50);
        star.endPos.set(endX, endY, -50);
        star.mesh.position.copy(star.startPos);
        star.mesh.visible = true;
        star.active = true;
        star.startTime = performance.now();
    }
    updateShootingStars() {
        const now = performance.now();
        for (const star of this.shootingStars) {
            if (!star.active) {
                // 流れ星を出す確率
                if (Math.random() < 0.005) {
                    this.startShootingStar(star);
                }
            }
            else {
                const t = (now - star.startTime) / star.duration;
                if (t >= 1) {
                    star.mesh.visible = false;
                    star.active = false;
                }
                else {
                    star.mesh.position.set(star.startPos.x + (star.endPos.x - star.startPos.x) * t, star.startPos.y + (star.endPos.y - star.startPos.y) * t, star.startPos.z + (star.endPos.z - star.startPos.z) * t);
                }
            }
        }
    }
    animateShootingStar() {
        // shooting star animation handled by GSAP
    }
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    const container = new ThreeJSContainer();
    const viewport = container.createRendererDOM(800, 600, new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 30));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_three_build_three_module_js"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyAyM0ZJMDU1IOmItOacqCDnq6DlpKpcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuaW1wb3J0IGdzYXAgZnJvbSBcImdzYXBcIjtcbmltcG9ydCB7IEdyb3VwIH0gZnJvbSBcIkB0d2VlbmpzL3R3ZWVuLmpzXCI7XG5cbmludGVyZmFjZSBTaG9vdGluZ1N0YXIge1xuICAgIG1lc2g6IFRIUkVFLk1lc2g7XG4gICAgYWN0aXZlOiBib29sZWFuO1xuICAgIHN0YXJ0VGltZTogbnVtYmVyO1xuICAgIGR1cmF0aW9uOiBudW1iZXI7XG4gICAgc3RhcnRQb3M6IFRIUkVFLlZlY3RvcjM7XG4gICAgZW5kUG9zOiBUSFJFRS5WZWN0b3IzO1xufVxuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcbiAgICBwcml2YXRlIHNob290aW5nU3RhcjogVEhSRUUuTWVzaDtcbiAgICBwcml2YXRlIHNob290aW5nU3RhckFjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgc3Rhckdyb3VwOiBUSFJFRS5Hcm91cCB8IG51bGwgPSBudWxsO1xuICAgIHByaXZhdGUgcmVuZGVyZXI6IFRIUkVFLldlYkdMUmVuZGVyZXI7XG4gICAgcHJpdmF0ZSBjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuICAgIHByaXZhdGUgb3JiaXRDb250cm9sczogT3JiaXRDb250cm9scztcbiAgICBwcml2YXRlIHNob290aW5nU3RhcnM6IFNob290aW5nU3RhcltdID0gW107XG4gICAgXG5cbiAgICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBwdWJsaWMgY3JlYXRlUmVuZGVyZXJET00gPSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGNhbWVyYVBvczogVEhSRUUuVmVjdG9yMykgPT4ge1xuICAgICAgICBjb25zdCByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4NDk1ZWQpKTtcbiAgICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIOOCq+ODoeODqeioreWumlxuICAgICAgICBjb25zdCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpZHRoIC8gaGVpZ2h0LCAwLjEsIDEwMDApO1xuICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weShjYW1lcmFQb3MpO1xuXG4gICAgICAgIGxldCB5YXcgPSBNYXRoLlBJOyAgIC8vIOW3puWPs+Wbnui7olxuICAgICAgICBsZXQgcGl0Y2ggPSAwOyAvLyDkuIrkuIvlm57ou6JcbiAgICAgICAgY29uc3Qgcm90YXRlU3BlZWQgPSAwLjA1O1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNhbWVyYURpcmVjdGlvbigpIHtcbiAgICAgICAgICAgIC8vIOWQkeOBhOOBpuOBhOOCi+aWueWQkeOCkuioiOeul1xuICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoXG4gICAgICAgICAgICAgICAgTWF0aC5zaW4oeWF3KSAqIE1hdGguY29zKHBpdGNoKSxcbiAgICAgICAgICAgICAgICBNYXRoLnNpbihwaXRjaCksXG4gICAgICAgICAgICAgICAgTWF0aC5jb3MoeWF3KSAqIE1hdGguY29zKHBpdGNoKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY2FtZXJhLmxvb2tBdChjYW1lcmEucG9zaXRpb24uY2xvbmUoKS5hZGQoZGlyZWN0aW9uKSk7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5rZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dMZWZ0XCI6XG4gICAgICAgICAgICAgICAgICAgIHlhdyArPSByb3RhdGVTcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkFycm93UmlnaHRcIjpcbiAgICAgICAgICAgICAgICAgICAgeWF3IC09IHJvdGF0ZVNwZWVkO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dVcFwiOlxuICAgICAgICAgICAgICAgICAgICBwaXRjaCA9IE1hdGgubWluKE1hdGguUEkgLyAyIC0gMC4xLCBwaXRjaCArIHJvdGF0ZVNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkFycm93RG93blwiOlxuICAgICAgICAgICAgICAgICAgICBwaXRjaCA9IE1hdGgubWF4KC1NYXRoLlBJIC8gMiArIDAuMSwgcGl0Y2ggLSByb3RhdGVTcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXBkYXRlQ2FtZXJhRGlyZWN0aW9uKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlU2NlbmUoKTtcblxuICAgICAgICBjb25zdCByZW5kZXI6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTaG9vdGluZ1N0YXJzKCk7XG4gICAgICAgICAgICB1cGRhdGVDYW1lcmFEaXJlY3Rpb24oKTtcbiAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCBjYW1lcmEpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gICAgICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDAwMDAwMCkpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICAgICAgICByZXR1cm4gcmVuZGVyZXIuZG9tRWxlbWVudDtcbiAgICB9O1xuXG5cblxuXG5cbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAgICAgLy8g5pif44Gu5L2c5oiQXG4gICAgICAgIGNvbnN0IHN0YXJDb3VudCA9IDIwMDA7XG4gICAgICAgIGNvbnN0IHIgPSA1MDtcbiAgICAgICAgY29uc3QgY29sb3JzID0gWzB4MWM3YWZmLCAweGZmMGYyZiwgMHhmZmZmZmZdOyAvLyDpnZIs6LWkLOeZvVxuICAgICAgICBjb25zdCBzdGFyUG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShzdGFyQ291bnQgKiAzKTtcbiAgICAgICAgY29uc3Qgc3RhckNvbG9ycyA9IG5ldyBGbG9hdDMyQXJyYXkoc3RhckNvdW50ICogMyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFyQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdSA9IDIgKiBNYXRoLlBJICogTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIGNvbnN0IHYgPSAyICogTWF0aC5QSSAqIE1hdGgucmFuZG9tKCkgLSBNYXRoLlBJIC8gMjtcbiAgICAgICAgICAgIGNvbnN0IHggPSByICogTWF0aC5jb3ModSkgKiBNYXRoLmNvcyh2KTtcbiAgICAgICAgICAgIGNvbnN0IHkgPSByICogTWF0aC5zaW4odSkgKiBNYXRoLmNvcyh2KTtcbiAgICAgICAgICAgIGNvbnN0IHogPSByICogTWF0aC5zaW4odik7XG5cbiAgICAgICAgICAgIHN0YXJQb3NpdGlvbnNbaSAqIDNdID0geDtcbiAgICAgICAgICAgIHN0YXJQb3NpdGlvbnNbaSAqIDMgKyAxXSA9IHk7XG4gICAgICAgICAgICBzdGFyUG9zaXRpb25zW2kgKiAzICsgMl0gPSB6O1xuXG4gICAgICAgICAgICAvLyDjg6njg7Pjg4Djg6Djgarjgqvjg6njg7zoqK3lrppcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbUNvbG9yID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIGxldCBjb2xvciA9IG5ldyBUSFJFRS5Db2xvcihjb2xvcnNbMl0pO1xuICAgICAgICAgICAgaWYocmFuZG9tQ29sb3IgPCAwLjA1KXtcbiAgICAgICAgICAgICAgICBjb2xvciA9IG5ldyBUSFJFRS5Db2xvcihjb2xvcnNbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZigwLjA1IDw9IHJhbmRvbUNvbG9yICYmIHJhbmRvbUNvbG9yIDwgMC4xKXtcbiAgICAgICAgICAgICAgICBjb2xvciA9IG5ldyBUSFJFRS5Db2xvcihjb2xvcnNbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3RhckNvbG9yc1tpICogM10gPSBjb2xvci5yO1xuICAgICAgICAgICAgc3RhckNvbG9yc1tpICogMyArIDFdID0gY29sb3IuZztcbiAgICAgICAgICAgIHN0YXJDb2xvcnNbaSAqIDMgKyAyXSA9IGNvbG9yLmI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGFyR2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcbiAgICAgICAgc3Rhckdlb21ldHJ5LnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHN0YXJQb3NpdGlvbnMsIDMpKTtcbiAgICAgICAgc3Rhckdlb21ldHJ5LnNldEF0dHJpYnV0ZSgnY29sb3InLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHN0YXJDb2xvcnMsIDMpKTtcblxuICAgICAgICBjb25zdCBzdGFyTWF0ZXJpYWwgPSBuZXcgVEhSRUUuUG9pbnRzTWF0ZXJpYWwoe1xuICAgICAgICAgICAgc2l6ZTogMC4yNSxcbiAgICAgICAgICAgIHZlcnRleENvbG9yczogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgb3BhY2l0eTogMC45XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHN0YXJzID0gbmV3IFRIUkVFLlBvaW50cyhzdGFyR2VvbWV0cnksIHN0YXJNYXRlcmlhbCk7XG4gICAgICAgIHRoaXMuc3Rhckdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICAgIHRoaXMuc3Rhckdyb3VwLmFkZChzdGFycyk7XG5cbiAgICAgICAgLy8g5pif44Gu5Zue6Lui6Lu4XG4gICAgICAgIHRoaXMuc3Rhckdyb3VwLnJvdGF0aW9uLnggPSBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoMzUpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLnN0YXJHcm91cCk7XG5cbiAgICAgICAgIC8vIOa1geOCjOaYn+OCquODluOCuOOCp+OCr+ODiOOCkuikh+aVsOeUn+aIkFxuICAgICAgICBcbiAgICAgICAgY29uc3QgZ2VvID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDAuMywgMTYsIDE2KTtcbiAgICAgICAgY29uc3QgbWF0ID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4YjBiOWQ1IH0pO1xuICAgICAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvLCBtYXQpO1xuICAgICAgICBtZXNoLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobWVzaCk7XG5cbiAgICAgICAgdGhpcy5zaG9vdGluZ1N0YXJzLnB1c2goe1xuICAgICAgICAgICAgbWVzaCxcbiAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgICAgICBzdGFydFRpbWU6IDAsXG4gICAgICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgICAgIHN0YXJ0UG9zOiBuZXcgVEhSRUUuVmVjdG9yMygpLFxuICAgICAgICAgICAgZW5kUG9zOiBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgICAgIH0pO1xuICAgICAgICBcblxuICAgICAgICAvLyDlnLDpnaJcbiAgICAgICAgY29uc3QgcmFkaXVzVG9wID0gNTA7ICAgICAgIC8vIOS4iumdouOBruWNiuW+hFxuICAgICAgICBjb25zdCByYWRpdXNCb3R0b20gPSA1MDsgICAgLy8g5bqV6Z2i44Gu5Y2K5b6EXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IDM7ICAgICAgICAgICAvLyDljprjgb/vvIjpq5jjgZXvvIlcbiAgICAgICAgY29uc3QgcmFkaWFsU2VnbWVudHMgPSA1MDsgIC8vIOWGhuWRqOWIhuWJsuaVsFxuXG4gICAgICAgIGNvbnN0IGN5bGluZGVyR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeShyYWRpdXNUb3AsIHJhZGl1c0JvdHRvbSwgaGVpZ2h0LCByYWRpYWxTZWdtZW50cyk7XG4gICAgICAgIGNvbnN0IGN5bGluZGVyTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweDIyNTUyMiB9KTtcbiAgICAgICAgY29uc3QgY3lsaW5kZXIgPSBuZXcgVEhSRUUuTWVzaChjeWxpbmRlckdlb21ldHJ5LCBjeWxpbmRlck1hdGVyaWFsKTtcblxuICAgICAgICAvLyDlnLDpnaLjga7jgojjgYbjgasgeSA9IDAg44Gr5rK/44KP44Gb44KLXG4gICAgICAgIGN5bGluZGVyLnBvc2l0aW9uLnkgPSAtIGhlaWdodCAvIDI7XG5cbiAgICAgICAgY3lsaW5kZXIucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGN5bGluZGVyKTtcblxuICAgICAgICAvLyDlsbHvvIjljZfvvIlcbiAgICAgICAgY29uc3QgbW91bnRhaW5IZWlnaHQgPSAxMDtcbiAgICAgICAgY29uc3QgbGVmdE1vdW50YWluSGVpZ2h0ID0gMTU7XG4gICAgICAgIGNvbnN0IG1vdW50YWluR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ29uZUdlb21ldHJ5KDE1LCBtb3VudGFpbkhlaWdodCwgOCk7XG4gICAgICAgIGNvbnN0IGxlZnRNb3VudGFpbkdlb21ldHJ5ID0gbmV3IFRIUkVFLkNvbmVHZW9tZXRyeSgxNSwgbGVmdE1vdW50YWluSGVpZ2h0LCA4KTtcbiAgICAgICAgY29uc3QgbW91bnRhaW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweDIyNTUyMiB9KTtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgbGV0IG1vdW50YWluID0gbmV3IFRIUkVFLk1lc2gobW91bnRhaW5HZW9tZXRyeSwgbW91bnRhaW5NYXRlcmlhbCk7XG4gICAgICAgICAgICBtb3VudGFpbi5wb3NpdGlvbi5zZXQoMTUgKiAoaSAtIDEpLCBtb3VudGFpbkhlaWdodCAvIDIsIC0yMCk7XG4gICAgICAgICAgICBpZihpID09IDIpe1xuICAgICAgICAgICAgICAgIG1vdW50YWluID0gbmV3IFRIUkVFLk1lc2gobGVmdE1vdW50YWluR2VvbWV0cnksIG1vdW50YWluTWF0ZXJpYWwpO1xuICAgICAgICAgICAgICAgIG1vdW50YWluLnBvc2l0aW9uLnNldCgxNSAqIChpIC0gMSksIGxlZnRNb3VudGFpbkhlaWdodCAvIDIsIC0yMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChtb3VudGFpbik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy/nnJ/lvozjgo3jga7lsbEo5YyXKVxuICAgICAgICBsZXQgbm9ydGhNb3VudGFpbiA9IG5ldyBUSFJFRS5NZXNoKG1vdW50YWluR2VvbWV0cnksIG1vdW50YWluTWF0ZXJpYWwpO1xuICAgICAgICBub3J0aE1vdW50YWluLnBvc2l0aW9uLnNldCgwICwgbW91bnRhaW5IZWlnaHQgLyAyLCA1MCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKG5vcnRoTW91bnRhaW4pO1xuXG4gICAgICAgIC8vIOWPs+OBruWxse+8iOadse+8iVxuICAgICAgICBsZXQgZWFzdE1vdW50YWluID0gbmV3IFRIUkVFLk1lc2gobW91bnRhaW5HZW9tZXRyeSwgbW91bnRhaW5NYXRlcmlhbCk7XG4gICAgICAgIGVhc3RNb3VudGFpbi5wb3NpdGlvbi5zZXQoMzAgLCBtb3VudGFpbkhlaWdodCAvIDIsIDMwKTtcbiAgICAgICAgZWFzdE1vdW50YWluLnJvdGF0ZVkoTWF0aC5QSSAvIDIpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChlYXN0TW91bnRhaW4pO1xuXG4gICAgICAgIC8vIOW3puOBruWxse+8iOilv++8iVxuICAgICAgICBsZXQgd2VzdE1vdW50YWluID0gbmV3IFRIUkVFLk1lc2gobW91bnRhaW5HZW9tZXRyeSwgbW91bnRhaW5NYXRlcmlhbCk7XG4gICAgICAgIHdlc3RNb3VudGFpbi5wb3NpdGlvbi5zZXQoLTMwICwgbW91bnRhaW5IZWlnaHQgLyAyLCAzMCk7XG4gICAgICAgIHdlc3RNb3VudGFpbi5yb3RhdGVZKC1NYXRoLlBJIC8gMik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHdlc3RNb3VudGFpbik7XG5cbiAgICAgICAgLy8g5bem44Gu5bKpXG4gICAgICAgIGNvbnN0IHN0b25lTGVmdEhlaWdodCA9IDI7XG4gICAgICAgIGNvbnN0IGxlZnRTdG9uZUdlb21ldG9yeSA9IG5ldyBUSFJFRS5Db25lR2VvbWV0cnkoMiwgc3RvbmVMZWZ0SGVpZ2h0LCA0KTtcbiAgICAgICAgY29uc3Qgc3RvbmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweDNmM2MzNSB9KTtcbiAgICAgICAgbGV0IGxlZnRTdG9uZSA9IG5ldyBUSFJFRS5NZXNoKGxlZnRTdG9uZUdlb21ldG9yeSwgc3RvbmVNYXRlcmlhbCk7XG4gICAgICAgIGxlZnRTdG9uZS5wb3NpdGlvbi5zZXQoLTMuNSwgc3RvbmVMZWZ0SGVpZ2h0IC8gMiwgMjMpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChsZWZ0U3RvbmUpO1xuXG4gICAgICAgIC8vIOWPs+OBruWyqVxuICAgICAgICBjb25zdCBzdG9uZVJpZ2h0SGVpZ2h0ID0gNztcbiAgICAgICAgY29uc3QgcmlnaHRTdG9uZUdlb21ldG9yeSA9IG5ldyBUSFJFRS5Db25lR2VvbWV0cnkoMiwgc3RvbmVSaWdodEhlaWdodCwgNCk7XG4gICAgICAgIGxldCByaWdodFN0b25lID0gbmV3IFRIUkVFLk1lc2gocmlnaHRTdG9uZUdlb21ldG9yeSwgc3RvbmVNYXRlcmlhbCk7XG4gICAgICAgIHJpZ2h0U3RvbmUucG9zaXRpb24uc2V0KDMuNSwgc3RvbmVMZWZ0SGVpZ2h0IC8gMiwgMjMpO1xuICAgICAgICByaWdodFN0b25lLnJvdGF0aW9uLnogPSAtIE1hdGguUEkgLyA2O1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChyaWdodFN0b25lKTtcblxuICAgICAgICAvLyDjg6njgqTjg4hcbiAgICAgICAgdGhpcy5saWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAxKTtcbiAgICAgICAgdGhpcy5saWdodC5wb3NpdGlvbi5zZXQoMTAsIDIwLCAxMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMubGlnaHQpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4NDA0MDQwKSk7XG5cbiAgICAgICAgbGV0IHVwZGF0ZTogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3Rhckdyb3VwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFyR3JvdXAucm90YXRpb24ueSAtPSAwLjAwMTsgLy8g5pif44Gu5Zue6LuiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH07XG5cblxuICAgIHByaXZhdGUgc3RhcnRTaG9vdGluZ1N0YXIoc3RhcjogU2hvb3RpbmdTdGFyKSB7XG4gICAgICAgIC8vIOODqeODs+ODgOODoOOBqumWi+Wni+ODu+e1guS6huS9jee9rlxuICAgICAgICBjb25zdCBzdGFydFJhbmRvbVggPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICBjb25zdCBlbmRSYW5kb21YID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgbGV0IHN0YXJ0WCA9IC0zMCArIE1hdGgucmFuZG9tKCkgKiA0MDtcbiAgICAgICAgbGV0IHN0YXJ0WSA9IDMwICsgTWF0aC5yYW5kb20oKSAqIDQwO1xuICAgICAgICBsZXQgZW5kWCA9IDMwICsgTWF0aC5yYW5kb20oKSAqIDQwO1xuICAgICAgICBsZXQgZW5kWSA9IC01ICsgTWF0aC5yYW5kb20oKSAqIDEwO1xuXG4gICAgICAgIGlmKHN0YXJ0UmFuZG9tWCA+IDAuNSl7XG4gICAgICAgICAgICBzdGFydFggKj0gIC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmKGVuZFJhbmRvbVggPiAwLjUpe1xuICAgICAgICAgICAgZW5kWCAqPSAgLTE7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFyLnN0YXJ0UG9zLnNldChzdGFydFgsIHN0YXJ0WSwgLTUwKTtcbiAgICAgICAgc3Rhci5lbmRQb3Muc2V0KGVuZFgsIGVuZFksIC01MCk7XG5cbiAgICAgICAgc3Rhci5tZXNoLnBvc2l0aW9uLmNvcHkoc3Rhci5zdGFydFBvcyk7XG4gICAgICAgIHN0YXIubWVzaC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgc3Rhci5hY3RpdmUgPSB0cnVlO1xuICAgICAgICBzdGFyLnN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlU2hvb3RpbmdTdGFycygpIHtcbiAgICAgICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIGZvciAoY29uc3Qgc3RhciBvZiB0aGlzLnNob290aW5nU3RhcnMpIHtcbiAgICAgICAgICAgIGlmICghc3Rhci5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAvLyDmtYHjgozmmJ/jgpLlh7rjgZnnorrnjodcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuMDA1KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRTaG9vdGluZ1N0YXIoc3Rhcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ID0gKG5vdyAtIHN0YXIuc3RhcnRUaW1lKSAvIHN0YXIuZHVyYXRpb247XG4gICAgICAgICAgICAgICAgaWYgKHQgPj0gMSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFyLm1lc2gudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdGFyLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXIubWVzaC5wb3NpdGlvbi5zZXQoXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFyLnN0YXJ0UG9zLnggKyAoc3Rhci5lbmRQb3MueCAtIHN0YXIuc3RhcnRQb3MueCkgKiB0LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3Rhci5zdGFydFBvcy55ICsgKHN0YXIuZW5kUG9zLnkgLSBzdGFyLnN0YXJ0UG9zLnkpICogdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXIuc3RhcnRQb3MueiArIChzdGFyLmVuZFBvcy56IC0gc3Rhci5zdGFydFBvcy56KSAqIHRcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGVTaG9vdGluZ1N0YXIoKSB7XG4gICAgICAgIC8vIHNob290aW5nIHN0YXIgYW5pbWF0aW9uIGhhbmRsZWQgYnkgR1NBUFxuICAgIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IG5ldyBUaHJlZUpTQ29udGFpbmVyKCk7XG4gICAgY29uc3Qgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00oODAwLCA2MDAsIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDMwKSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG59XG5cblxuXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX3RocmVlX2J1aWxkX3RocmVlX21vZHVsZV9qc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==