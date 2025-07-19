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
    starGroup = null;
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
        this.light.position.set(0, 40, -50);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyAyM0ZJMDU1IOmItOacqCDnq6DlpKpcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5cbmludGVyZmFjZSBTaG9vdGluZ1N0YXIge1xuICAgIG1lc2g6IFRIUkVFLk1lc2g7XG4gICAgYWN0aXZlOiBib29sZWFuO1xuICAgIHN0YXJ0VGltZTogbnVtYmVyO1xuICAgIGR1cmF0aW9uOiBudW1iZXI7XG4gICAgc3RhcnRQb3M6IFRIUkVFLlZlY3RvcjM7XG4gICAgZW5kUG9zOiBUSFJFRS5WZWN0b3IzO1xufVxuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcbiAgICBwcml2YXRlIHN0YXJHcm91cDogVEhSRUUuR3JvdXAgfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIHNob290aW5nU3RhcnM6IFNob290aW5nU3RhcltdID0gW107XG4gICAgXG5cbiAgICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBwdWJsaWMgY3JlYXRlUmVuZGVyZXJET00gPSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGNhbWVyYVBvczogVEhSRUUuVmVjdG9yMykgPT4ge1xuICAgICAgICBjb25zdCByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4NDk1ZWQpKTtcbiAgICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIOOCq+ODoeODqeioreWumlxuICAgICAgICBjb25zdCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpZHRoIC8gaGVpZ2h0LCAwLjEsIDEwMDApO1xuICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weShjYW1lcmFQb3MpO1xuXG4gICAgICAgIGxldCB5YXcgPSBNYXRoLlBJOyAgIC8vIOW3puWPs+Wbnui7olxuICAgICAgICBsZXQgcGl0Y2ggPSAwOyAvLyDkuIrkuIvlm57ou6JcbiAgICAgICAgY29uc3Qgcm90YXRlU3BlZWQgPSAwLjA1O1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNhbWVyYURpcmVjdGlvbigpIHtcbiAgICAgICAgICAgIC8vIOWQkeOBhOOBpuOBhOOCi+aWueWQkeOCkuioiOeul1xuICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoXG4gICAgICAgICAgICAgICAgTWF0aC5zaW4oeWF3KSAqIE1hdGguY29zKHBpdGNoKSxcbiAgICAgICAgICAgICAgICBNYXRoLnNpbihwaXRjaCksXG4gICAgICAgICAgICAgICAgTWF0aC5jb3MoeWF3KSAqIE1hdGguY29zKHBpdGNoKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY2FtZXJhLmxvb2tBdChjYW1lcmEucG9zaXRpb24uY2xvbmUoKS5hZGQoZGlyZWN0aW9uKSk7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5rZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dMZWZ0XCI6XG4gICAgICAgICAgICAgICAgICAgIHlhdyArPSByb3RhdGVTcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkFycm93UmlnaHRcIjpcbiAgICAgICAgICAgICAgICAgICAgeWF3IC09IHJvdGF0ZVNwZWVkO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dVcFwiOlxuICAgICAgICAgICAgICAgICAgICBwaXRjaCA9IE1hdGgubWluKE1hdGguUEkgLyAyIC0gMC4xLCBwaXRjaCArIHJvdGF0ZVNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkFycm93RG93blwiOlxuICAgICAgICAgICAgICAgICAgICBwaXRjaCA9IE1hdGgubWF4KC1NYXRoLlBJIC8gMiArIDAuMSwgcGl0Y2ggLSByb3RhdGVTcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXBkYXRlQ2FtZXJhRGlyZWN0aW9uKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlU2NlbmUoKTtcblxuICAgICAgICBjb25zdCByZW5kZXI6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTaG9vdGluZ1N0YXJzKCk7XG4gICAgICAgICAgICB1cGRhdGVDYW1lcmFEaXJlY3Rpb24oKTtcbiAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCBjYW1lcmEpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gICAgICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDAwMDAwMCkpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICAgICAgICByZXR1cm4gcmVuZGVyZXIuZG9tRWxlbWVudDtcbiAgICB9O1xuXG5cblxuXG5cbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAgICAgLy8g5pif44Gu5L2c5oiQXG4gICAgICAgIGNvbnN0IHN0YXJDb3VudCA9IDIwMDA7XG4gICAgICAgIGNvbnN0IHIgPSA1MDtcbiAgICAgICAgY29uc3QgY29sb3JzID0gWzB4MWM3YWZmLCAweGZmMGYyZiwgMHhmZmZmZmZdOyAvLyDpnZIs6LWkLOeZvVxuICAgICAgICBjb25zdCBzdGFyUG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShzdGFyQ291bnQgKiAzKTtcbiAgICAgICAgY29uc3Qgc3RhckNvbG9ycyA9IG5ldyBGbG9hdDMyQXJyYXkoc3RhckNvdW50ICogMyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFyQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdSA9IDIgKiBNYXRoLlBJICogTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIGNvbnN0IHYgPSAyICogTWF0aC5QSSAqIE1hdGgucmFuZG9tKCkgLSBNYXRoLlBJIC8gMjtcbiAgICAgICAgICAgIGNvbnN0IHggPSByICogTWF0aC5jb3ModSkgKiBNYXRoLmNvcyh2KTtcbiAgICAgICAgICAgIGNvbnN0IHkgPSByICogTWF0aC5zaW4odSkgKiBNYXRoLmNvcyh2KTtcbiAgICAgICAgICAgIGNvbnN0IHogPSByICogTWF0aC5zaW4odik7XG5cbiAgICAgICAgICAgIHN0YXJQb3NpdGlvbnNbaSAqIDNdID0geDtcbiAgICAgICAgICAgIHN0YXJQb3NpdGlvbnNbaSAqIDMgKyAxXSA9IHk7XG4gICAgICAgICAgICBzdGFyUG9zaXRpb25zW2kgKiAzICsgMl0gPSB6O1xuXG4gICAgICAgICAgICAvLyDjg6njg7Pjg4Djg6Djgarjgqvjg6njg7zoqK3lrppcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbUNvbG9yID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIGxldCBjb2xvciA9IG5ldyBUSFJFRS5Db2xvcihjb2xvcnNbMl0pO1xuICAgICAgICAgICAgaWYocmFuZG9tQ29sb3IgPCAwLjA1KXtcbiAgICAgICAgICAgICAgICBjb2xvciA9IG5ldyBUSFJFRS5Db2xvcihjb2xvcnNbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZigwLjA1IDw9IHJhbmRvbUNvbG9yICYmIHJhbmRvbUNvbG9yIDwgMC4xKXtcbiAgICAgICAgICAgICAgICBjb2xvciA9IG5ldyBUSFJFRS5Db2xvcihjb2xvcnNbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3RhckNvbG9yc1tpICogM10gPSBjb2xvci5yO1xuICAgICAgICAgICAgc3RhckNvbG9yc1tpICogMyArIDFdID0gY29sb3IuZztcbiAgICAgICAgICAgIHN0YXJDb2xvcnNbaSAqIDMgKyAyXSA9IGNvbG9yLmI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGFyR2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcbiAgICAgICAgc3Rhckdlb21ldHJ5LnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHN0YXJQb3NpdGlvbnMsIDMpKTtcbiAgICAgICAgc3Rhckdlb21ldHJ5LnNldEF0dHJpYnV0ZSgnY29sb3InLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHN0YXJDb2xvcnMsIDMpKTtcblxuICAgICAgICBjb25zdCBzdGFyTWF0ZXJpYWwgPSBuZXcgVEhSRUUuUG9pbnRzTWF0ZXJpYWwoe1xuICAgICAgICAgICAgc2l6ZTogMC4yNSxcbiAgICAgICAgICAgIHZlcnRleENvbG9yczogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgb3BhY2l0eTogMC45XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHN0YXJzID0gbmV3IFRIUkVFLlBvaW50cyhzdGFyR2VvbWV0cnksIHN0YXJNYXRlcmlhbCk7XG4gICAgICAgIHRoaXMuc3Rhckdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICAgIHRoaXMuc3Rhckdyb3VwLmFkZChzdGFycyk7XG5cbiAgICAgICAgLy8g5pif44Gu5Zue6Lui6Lu4XG4gICAgICAgIHRoaXMuc3Rhckdyb3VwLnJvdGF0aW9uLnggPSBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoMzUpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLnN0YXJHcm91cCk7XG5cbiAgICAgICAgIC8vIOa1geOCjOaYn+OCquODluOCuOOCp+OCr+ODiOOCkuikh+aVsOeUn+aIkFxuICAgICAgICBcbiAgICAgICAgY29uc3QgZ2VvID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDAuMywgMTYsIDE2KTtcbiAgICAgICAgY29uc3QgbWF0ID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4YjBiOWQ1IH0pO1xuICAgICAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvLCBtYXQpO1xuICAgICAgICBtZXNoLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobWVzaCk7XG5cbiAgICAgICAgdGhpcy5zaG9vdGluZ1N0YXJzLnB1c2goe1xuICAgICAgICAgICAgbWVzaCxcbiAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgICAgICBzdGFydFRpbWU6IDAsXG4gICAgICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgICAgIHN0YXJ0UG9zOiBuZXcgVEhSRUUuVmVjdG9yMygpLFxuICAgICAgICAgICAgZW5kUG9zOiBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgICAgIH0pO1xuICAgICAgICBcblxuICAgICAgICAvLyDlnLDpnaJcbiAgICAgICAgY29uc3QgcmFkaXVzVG9wID0gNTA7ICAgICAgIC8vIOS4iumdouOBruWNiuW+hFxuICAgICAgICBjb25zdCByYWRpdXNCb3R0b20gPSA1MDsgICAgLy8g5bqV6Z2i44Gu5Y2K5b6EXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IDM7ICAgICAgICAgICAvLyDljprjgb/vvIjpq5jjgZXvvIlcbiAgICAgICAgY29uc3QgcmFkaWFsU2VnbWVudHMgPSA1MDsgIC8vIOWGhuWRqOWIhuWJsuaVsFxuXG4gICAgICAgIGNvbnN0IGN5bGluZGVyR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeShyYWRpdXNUb3AsIHJhZGl1c0JvdHRvbSwgaGVpZ2h0LCByYWRpYWxTZWdtZW50cyk7XG4gICAgICAgIGNvbnN0IGN5bGluZGVyTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweDIyNTUyMiB9KTtcbiAgICAgICAgY29uc3QgY3lsaW5kZXIgPSBuZXcgVEhSRUUuTWVzaChjeWxpbmRlckdlb21ldHJ5LCBjeWxpbmRlck1hdGVyaWFsKTtcblxuICAgICAgICAvLyDlnLDpnaLjga7jgojjgYbjgasgeSA9IDAg44Gr5rK/44KP44Gb44KLXG4gICAgICAgIGN5bGluZGVyLnBvc2l0aW9uLnkgPSAtIGhlaWdodCAvIDI7XG5cbiAgICAgICAgY3lsaW5kZXIucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGN5bGluZGVyKTtcblxuICAgICAgICAvLyDlsbHvvIjljZfvvIlcbiAgICAgICAgY29uc3QgbW91bnRhaW5IZWlnaHQgPSAxMDtcbiAgICAgICAgY29uc3QgbGVmdE1vdW50YWluSGVpZ2h0ID0gMTU7XG4gICAgICAgIGNvbnN0IG1vdW50YWluR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ29uZUdlb21ldHJ5KDE1LCBtb3VudGFpbkhlaWdodCwgOCk7XG4gICAgICAgIGNvbnN0IGxlZnRNb3VudGFpbkdlb21ldHJ5ID0gbmV3IFRIUkVFLkNvbmVHZW9tZXRyeSgxNSwgbGVmdE1vdW50YWluSGVpZ2h0LCA4KTtcbiAgICAgICAgY29uc3QgbW91bnRhaW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweDIyNTUyMiB9KTtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgbGV0IG1vdW50YWluID0gbmV3IFRIUkVFLk1lc2gobW91bnRhaW5HZW9tZXRyeSwgbW91bnRhaW5NYXRlcmlhbCk7XG4gICAgICAgICAgICBtb3VudGFpbi5wb3NpdGlvbi5zZXQoMTUgKiAoaSAtIDEpLCBtb3VudGFpbkhlaWdodCAvIDIsIC0yMCk7XG4gICAgICAgICAgICBpZihpID09IDIpe1xuICAgICAgICAgICAgICAgIG1vdW50YWluID0gbmV3IFRIUkVFLk1lc2gobGVmdE1vdW50YWluR2VvbWV0cnksIG1vdW50YWluTWF0ZXJpYWwpO1xuICAgICAgICAgICAgICAgIG1vdW50YWluLnBvc2l0aW9uLnNldCgxNSAqIChpIC0gMSksIGxlZnRNb3VudGFpbkhlaWdodCAvIDIsIC0yMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChtb3VudGFpbik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy/nnJ/lvozjgo3jga7lsbEo5YyXKVxuICAgICAgICBsZXQgbm9ydGhNb3VudGFpbiA9IG5ldyBUSFJFRS5NZXNoKG1vdW50YWluR2VvbWV0cnksIG1vdW50YWluTWF0ZXJpYWwpO1xuICAgICAgICBub3J0aE1vdW50YWluLnBvc2l0aW9uLnNldCgwICwgbW91bnRhaW5IZWlnaHQgLyAyLCA1MCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKG5vcnRoTW91bnRhaW4pO1xuXG4gICAgICAgIC8vIOWPs+OBruWxse+8iOadse+8iVxuICAgICAgICBsZXQgZWFzdE1vdW50YWluID0gbmV3IFRIUkVFLk1lc2gobW91bnRhaW5HZW9tZXRyeSwgbW91bnRhaW5NYXRlcmlhbCk7XG4gICAgICAgIGVhc3RNb3VudGFpbi5wb3NpdGlvbi5zZXQoMzAgLCBtb3VudGFpbkhlaWdodCAvIDIsIDMwKTtcbiAgICAgICAgZWFzdE1vdW50YWluLnJvdGF0ZVkoTWF0aC5QSSAvIDIpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChlYXN0TW91bnRhaW4pO1xuXG4gICAgICAgIC8vIOW3puOBruWxse+8iOilv++8iVxuICAgICAgICBsZXQgd2VzdE1vdW50YWluID0gbmV3IFRIUkVFLk1lc2gobW91bnRhaW5HZW9tZXRyeSwgbW91bnRhaW5NYXRlcmlhbCk7XG4gICAgICAgIHdlc3RNb3VudGFpbi5wb3NpdGlvbi5zZXQoLTMwICwgbW91bnRhaW5IZWlnaHQgLyAyLCAzMCk7XG4gICAgICAgIHdlc3RNb3VudGFpbi5yb3RhdGVZKC1NYXRoLlBJIC8gMik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHdlc3RNb3VudGFpbik7XG5cbiAgICAgICAgLy8g5bem44Gu5bKpXG4gICAgICAgIGNvbnN0IHN0b25lTGVmdEhlaWdodCA9IDI7XG4gICAgICAgIGNvbnN0IGxlZnRTdG9uZUdlb21ldG9yeSA9IG5ldyBUSFJFRS5Db25lR2VvbWV0cnkoMiwgc3RvbmVMZWZ0SGVpZ2h0LCA0KTtcbiAgICAgICAgY29uc3Qgc3RvbmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweDNmM2MzNSB9KTtcbiAgICAgICAgbGV0IGxlZnRTdG9uZSA9IG5ldyBUSFJFRS5NZXNoKGxlZnRTdG9uZUdlb21ldG9yeSwgc3RvbmVNYXRlcmlhbCk7XG4gICAgICAgIGxlZnRTdG9uZS5wb3NpdGlvbi5zZXQoLTMuNSwgc3RvbmVMZWZ0SGVpZ2h0IC8gMiwgMjMpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChsZWZ0U3RvbmUpO1xuXG4gICAgICAgIC8vIOWPs+OBruWyqVxuICAgICAgICBjb25zdCBzdG9uZVJpZ2h0SGVpZ2h0ID0gNztcbiAgICAgICAgY29uc3QgcmlnaHRTdG9uZUdlb21ldG9yeSA9IG5ldyBUSFJFRS5Db25lR2VvbWV0cnkoMiwgc3RvbmVSaWdodEhlaWdodCwgNCk7XG4gICAgICAgIGxldCByaWdodFN0b25lID0gbmV3IFRIUkVFLk1lc2gocmlnaHRTdG9uZUdlb21ldG9yeSwgc3RvbmVNYXRlcmlhbCk7XG4gICAgICAgIHJpZ2h0U3RvbmUucG9zaXRpb24uc2V0KDMuNSwgc3RvbmVMZWZ0SGVpZ2h0IC8gMiwgMjMpO1xuICAgICAgICByaWdodFN0b25lLnJvdGF0aW9uLnogPSAtIE1hdGguUEkgLyA2O1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChyaWdodFN0b25lKTtcblxuICAgICAgICAvLyDjg6njgqTjg4hcbiAgICAgICAgdGhpcy5saWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAxKTtcbiAgICAgICAgdGhpcy5saWdodC5wb3NpdGlvbi5zZXQoMCwgNDAsIC01MCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMubGlnaHQpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4NDA0MDQwKSk7XG5cbiAgICAgICAgbGV0IHVwZGF0ZTogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3Rhckdyb3VwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFyR3JvdXAucm90YXRpb24ueSAtPSAwLjAwMTsgLy8g5pif44Gu5Zue6LuiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH07XG5cblxuICAgIHByaXZhdGUgc3RhcnRTaG9vdGluZ1N0YXIoc3RhcjogU2hvb3RpbmdTdGFyKSB7XG4gICAgICAgIC8vIOODqeODs+ODgOODoOOBqumWi+Wni+ODu+e1guS6huS9jee9rlxuICAgICAgICBjb25zdCBzdGFydFJhbmRvbVggPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICBjb25zdCBlbmRSYW5kb21YID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgbGV0IHN0YXJ0WCA9IC0zMCArIE1hdGgucmFuZG9tKCkgKiA0MDtcbiAgICAgICAgbGV0IHN0YXJ0WSA9IDMwICsgTWF0aC5yYW5kb20oKSAqIDQwO1xuICAgICAgICBsZXQgZW5kWCA9IDMwICsgTWF0aC5yYW5kb20oKSAqIDQwO1xuICAgICAgICBsZXQgZW5kWSA9IC01ICsgTWF0aC5yYW5kb20oKSAqIDEwO1xuXG4gICAgICAgIGlmKHN0YXJ0UmFuZG9tWCA+IDAuNSl7XG4gICAgICAgICAgICBzdGFydFggKj0gIC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmKGVuZFJhbmRvbVggPiAwLjUpe1xuICAgICAgICAgICAgZW5kWCAqPSAgLTE7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFyLnN0YXJ0UG9zLnNldChzdGFydFgsIHN0YXJ0WSwgLTUwKTtcbiAgICAgICAgc3Rhci5lbmRQb3Muc2V0KGVuZFgsIGVuZFksIC01MCk7XG5cbiAgICAgICAgc3Rhci5tZXNoLnBvc2l0aW9uLmNvcHkoc3Rhci5zdGFydFBvcyk7XG4gICAgICAgIHN0YXIubWVzaC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgc3Rhci5hY3RpdmUgPSB0cnVlO1xuICAgICAgICBzdGFyLnN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlU2hvb3RpbmdTdGFycygpIHtcbiAgICAgICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIGZvciAoY29uc3Qgc3RhciBvZiB0aGlzLnNob290aW5nU3RhcnMpIHtcbiAgICAgICAgICAgIGlmICghc3Rhci5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAvLyDmtYHjgozmmJ/jgpLlh7rjgZnnorrnjodcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuMDA1KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRTaG9vdGluZ1N0YXIoc3Rhcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ID0gKG5vdyAtIHN0YXIuc3RhcnRUaW1lKSAvIHN0YXIuZHVyYXRpb247XG4gICAgICAgICAgICAgICAgaWYgKHQgPj0gMSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFyLm1lc2gudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdGFyLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXIubWVzaC5wb3NpdGlvbi5zZXQoXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFyLnN0YXJ0UG9zLnggKyAoc3Rhci5lbmRQb3MueCAtIHN0YXIuc3RhcnRQb3MueCkgKiB0LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3Rhci5zdGFydFBvcy55ICsgKHN0YXIuZW5kUG9zLnkgLSBzdGFyLnN0YXJ0UG9zLnkpICogdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXIuc3RhcnRQb3MueiArIChzdGFyLmVuZFBvcy56IC0gc3Rhci5zdGFydFBvcy56KSAqIHRcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xuICAgIGNvbnN0IHZpZXdwb3J0ID0gY29udGFpbmVyLmNyZWF0ZVJlbmRlcmVyRE9NKDgwMCwgNjAwLCBuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAzMCkpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlld3BvcnQpO1xufVxuXG5cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc190aHJlZV9idWlsZF90aHJlZV9tb2R1bGVfanNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=